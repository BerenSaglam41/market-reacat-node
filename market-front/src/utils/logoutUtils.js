// Logout Utility Functions

/**
 * Tüm kullanıcı verilerini temizler
 */
export const clearAllUserData = () => {
  console.log('🧹 Clearing all user data...');
  
  // LocalStorage temizleme - TÜM potansiyel keys
  const keysToRemove = [
    'user',
    'cart', 
    'orders',
    'orderHistory',
    'myOrders',
    'addresses',
    'userAddresses',
    'checkout',
    'checkoutData',
    'payment',
    'paymentInfo',
    'shippingInfo',
    'billingInfo',
    'userPreferences',
    'userSettings',
    'recentSearches',
    'searchHistory',
    'wishlist',
    'favorites',
    'recentProducts',
    'userProfile',
    'authToken',
    'refreshToken',
    'lastLogin',
    'sessionData'
  ];
  
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`🗑️ Removed localStorage: ${key}`);
    }
  });
  
  // Tüm localStorage'ı tarayıp user ile ilgili her şeyi temizle
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('user') || 
        lowerKey.includes('order') || 
        lowerKey.includes('cart') || 
        lowerKey.includes('checkout') ||
        lowerKey.includes('payment') ||
        lowerKey.includes('address') ||
        lowerKey.includes('auth') ||
        lowerKey.includes('session')) {
      localStorage.removeItem(key);
      console.log(`🗑️ Pattern-matched removal: ${key}`);
    }
  });
  
  // SessionStorage tamamen temizle
  try {
    sessionStorage.clear();
    console.log('🗑️ SessionStorage cleared completely');
  } catch (e) {
    console.warn('⚠️ Could not clear sessionStorage:', e);
  }
  
  // Cookies temizleme (client-side)
  document.cookie.split(";").forEach((c) => {
    const eqPos = c.indexOf("=");
    const name = eqPos > -1 ? c.substr(0, eqPos) : c;
    const cleanName = name.trim();
    
    // Kendi domain'imizin cookie'lerini temizle
    if (cleanName.includes('token') || 
        cleanName.includes('session') || 
        cleanName.includes('auth') ||
        cleanName.includes('user') ||
        cleanName.includes('login')) {
      document.cookie = `${cleanName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${cleanName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      console.log(`🍪 Cleared cookie: ${cleanName}`);
    }
  });
  
  console.log('✅ All user data cleared completely');
};

/**
 * Redux store'u temizler
 */
export const clearReduxStore = (dispatch) => {
  console.log('🔄 Clearing Redux store...');
  
  // Account state temizle
  dispatch({ type: 'account/clearUserData' });
  
  // Cart state temizle
  dispatch({ type: 'cart/clearCart' });
  
  // Product cache temizle (eğer varsa)
  try {
    dispatch({ type: 'product/clearCache' });
  } catch (e) {
    console.log('📦 Product cache clear skipped (not implemented)');
  }
  
  // Diğer potansiyel state'leri temizle
  const statesToClear = [
    'orders/clearOrders',
    'checkout/clearCheckout', 
    'payment/clearPayment',
    'addresses/clearAddresses',
    'search/clearHistory'
  ];
  
  statesToClear.forEach(actionType => {
    try {
      dispatch({ type: actionType });
      console.log(`🔄 Cleared: ${actionType}`);
    } catch (e) {
      // Silent fail for non-existent slices
    }
  });
  
  console.log('✅ Redux store cleared completely');
};