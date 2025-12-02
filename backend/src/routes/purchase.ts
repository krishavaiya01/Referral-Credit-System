import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Referral } from '../models/Referral.js';

const router = Router();

router.post('/purchase', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    // Atomically set hasPurchased from false -> true; if already true, do nothing
    const updated = await User.findOneAndUpdate(
      { _id: userId, hasPurchased: false },
      { $set: { hasPurchased: true } },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({ message: 'User already purchased' });
    }

    // Convert referral only if it exists and is still pending
    const convertResult = await Referral.updateOne(
      { referredUserID: updated._id, status: 'pending' },
      { $set: { status: 'converted' } }
    );

    if (convertResult.modifiedCount > 0) {
      // Credit both parties once; $inc is atomic
      await Promise.all([
        User.updateOne({ _id: updated._id }, { $inc: { credits: 2 } }),
        // Find the referrer id from the referral we just converted
        (async () => {
          const ref = await Referral.findOne({ referredUserID: updated._id }).lean();
          if (ref) {
            await User.updateOne({ _id: ref.referrerID }, { $inc: { credits: 2 } });
          }
        })()
      ]);
    }

    return res.status(200).json({ message: 'Purchase completed', hasPurchased: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
