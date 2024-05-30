// models/user.js

// No need for a model file when using Supabase, but here's a reference

class User {
    constructor(email, password) {
      this.email = email;
      this.password = password;
    }
  }
  
  module.exports = User;
  