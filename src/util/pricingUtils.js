/**
 * Frontend pricing & platform fee calculation utility
 * 
 * - Renter Service Fee: 10% on rental subtotal + delivery fee
 * - Owner Commission: 8% on rental subtotal + delivery fee
 * - Security Deposit: 20% of daily rate (0% fee, 100% refundable hold)
 */

export const calculateBookingPricing = ({
  pricePerDay,
  days,
  deliveryFee = 0,
  renterFeePercent = 10,
  ownerFeePercent = 8,
  depositPercent = 20,
}) => {
  const dailyRate = parseFloat(pricePerDay) || 0;
  const numDays = parseInt(days, 10) || 1;
  const delivery = parseFloat(deliveryFee) || 0;

  const rentalSubtotal = Math.round(dailyRate * numDays * 100) / 100;
  const rentalBasis = Math.round((rentalSubtotal + delivery) * 100) / 100;

  const renterRate = renterFeePercent / 100;
  const ownerRate = ownerFeePercent / 100;
  const depositRate = depositPercent / 100;

  const renterFee = Math.round(rentalBasis * renterRate * 100) / 100;
  const ownerCommission = Math.round(rentalBasis * ownerRate * 100) / 100;
  const platformTotalFee = Math.round((renterFee + ownerCommission) * 100) / 100;

  const totalRentalCharge = Math.round((rentalBasis + renterFee) * 100) / 100;
  const ownerPayoutAmount = Math.round((rentalBasis - ownerCommission) * 100) / 100;
  const depositAmount = Math.ceil(dailyRate * depositRate);

  const totalAmountWithDeposit = Math.round((totalRentalCharge + depositAmount) * 100) / 100;

  return {
    dailyRate,
    days: numDays,
    rentalSubtotal,
    deliveryFee: delivery,
    rentalBasis,
    renterFee,
    ownerCommission,
    platformTotalFee,
    totalRentalCharge,
    ownerPayoutAmount,
    depositAmount,
    totalAmountWithDeposit,
  };
};
