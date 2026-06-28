import Ambassador from '../models/Ambassador.js';
import { countReferralsForAmbassador } from '../utils/ysjApp.js';

export const getAmbassador = async (req, res, next) => {
  try {
    const ambassador = await Ambassador.findById(req.params.id);
    if (!ambassador) {
      return res.status(404).json({ message: 'Ambassador not found' });
    }
    res.json(ambassador);
  } catch (error) {
    next(error);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const ambassadors = await Ambassador.find().sort('-totalReferrals').limit(20).select('name email totalReferrals rewards country organization referralCode');
    const synced = await Promise.all(
      ambassadors.map(async (amb) => {
        try {
          const counts = await countReferralsForAmbassador(amb);
          if (amb.totalReferrals !== counts.total) {
            amb.totalReferrals = counts.total;
            await amb.save();
          }
        } catch (syncErr) {
          console.error(`Leaderboard sync error for ${amb.name}:`, syncErr.message);
        }
        return amb;
      })
    );
    res.json(synced);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, country, state, city, organization, bio, avatar } = req.body;
    const ambassador = await Ambassador.findByIdAndUpdate(
      req.params.id,
      { ...(name && { name }), ...(phone && { phone }), ...(country && { country }), ...(state && { state }), ...(city && { city }), ...(organization && { organization }), ...(bio && { bio }), ...(avatar && { avatar }) },
      { new: true, runValidators: true }
    );
    if (!ambassador) {
      return res.status(404).json({ message: 'Ambassador not found' });
    }
    res.json(ambassador);
  } catch (error) {
    next(error);
  }
};
