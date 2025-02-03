type Address = {
  postalCode: string;
  // Add other address fields as needed
}

export const isInRegion = (address: Address, postalCodePattern: string): boolean => {
  try {
    const normalizedPostalCode = address.postalCode.replace(/\s+/g, '').toUpperCase();
    const regex = new RegExp(postalCodePattern, 'i'); // case insensitive
    return regex.test(normalizedPostalCode);
  } catch (error) {
    console.error('Invalid regex pattern:', error);
    return false;
  }
}

export const calculateShippingOptions = async (payload: any, address: Address, cartTotal: number) => {
  const shippingOptions = await payload.find({
    collection: 'shipping-options',
    where: {
      isActive: {
        equals: true,
      },
    },
  });

  return shippingOptions.docs.map(option => {
    if (option.type === 'pickup') {
      return {
        id: option.id,
        name: option.name,
        type: 'pickup',
        price: 0,
      };
    }

    // Handle shipping options
    const { shippingRules } = option;
    let price = shippingRules.baseRate;

    // Check if order qualifies for free shipping based on total
    if (shippingRules.freeShippingThreshold && cartTotal >= shippingRules.freeShippingThreshold) {
      // Check if address is in any of the specified regions
      const isInFreeShippingRegion = shippingRules.regions.some(region => 
        isInRegion(address, region.postalCodePattern)
      );

      if (isInFreeShippingRegion) {
        price = 0;
      }
    }

    return {
      id: option.id,
      name: option.name,
      type: 'shipping',
      price,
    };
  });
}; 