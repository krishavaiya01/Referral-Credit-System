import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Referral } from '../models/Referral.js';

const router = Router();

router.get('/dashboard', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const referredCount = await Referral.countDocuments({ referrerID: user._id });
    const convertedCount = await Referral.countDocuments({ referrerID: user._id, status: 'converted' });

    return res.status(200).json({
      totalCredits: user.credits,
      referredUsers: referredCount,
      convertedUsers: convertedCount,
      referralCode: user.referralCode
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
