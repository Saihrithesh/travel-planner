import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: {
        validator: function(val) {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(val)) return false;

          const disposableDomains = [
            'tempmail.com', 'mailinator.com', 'yopmail.com', 'dispostable.com',
            'guerrillamail.com', 'sharklasers.com', '10minutemail.com',
            'trashmail.com', 'getairmail.com', 'temp-mail.org', 'tempmail.net',
            'mailinator.net', 'yopmail.net', 'fakeinbox.com', 'safetymail.info'
          ];
          const domain = val.split('@')[1].toLowerCase();
          return !disposableDomains.includes(domain);
        },
        message: 'Please provide a valid, non-fake email address'
      }
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      validate: {
        validator: function(val) {
          // At least 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(val);
        },
        message: 'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character'
      },
      select: false
    },
    passwordChangedAt: Date,
    favorites: [
      {
        type: String
      }
    ]
  },
  { timestamps: true }
);

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);
export default User;

