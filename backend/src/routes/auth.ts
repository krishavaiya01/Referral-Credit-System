import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Referral } from '../models/Referral.js';
import { generateReferralCode } from '../utils/generateReferralCode.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, username, referralCode } = req.body as {
      email: string; password: string; username?: string; referralCode?: string;
    };

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const baseName = username || email.split('@')[0];

    // Generate a unique referral code
    let code = generateReferralCode(baseName);
    // ensure uniqueness with a few retries
    for (let i = 0; i < 5; i++) {
      const codeClash = await User.findOne({ referralCode: code });
      if (!codeClash) break;
      code = generateReferralCode(baseName + i);
    }

    const user = await User.create({
      username: baseName,
      email,
      passwordHash,
      referralCode: code
    });

    // If referralCode provided, create a pending referral
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        try {
          await Referral.create({ referrerID: referrer._id, referredUserID: user._id, status: 'pending' });
        } catch (err) {
          // ignore duplicate referral attempts
        }
      }
    }

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        referralCode: user.referralCode,
        credits: user.credits,
        hasPurchased: user.hasPurchased
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        referralCode: user.referralCode,
        credits: user.credits,
        hasPurchased: user.hasPurchased
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
