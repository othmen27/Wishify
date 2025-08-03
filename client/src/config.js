// Configuration for API endpoints
const config = {
  // Change this to switch between local and production
  isDevelopment: false,
  
  // API endpoints
  localApiUrl: 'http://localhost:5000',
  productionApiUrl: 'http://18.209.102.221',
  
  // Get the current API URL based on environment
  getApiUrl() {
    return this.isDevelopment ? this.localApiUrl : this.productionApiUrl;
  }
};

export default config; 
