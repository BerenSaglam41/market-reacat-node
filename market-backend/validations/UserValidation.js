import User from "../models/User.js";

export const ValidateUser = async(data) => {
  const errors = {};
  if (!data) {
    errors.data = "Veri boş gönderildi.";
    return errors;
  }

  const {username, password, email} = data;

  if (!username || username.trim() === "") {
    errors.username = "Kullanıcı adı boş bırakılamaz.";
  } else {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      errors.username = "Bu kullanıcı adı zaten kayıtlı.";
    }
  }

  if (!email || email.trim() === "") {
    errors.email = "Email boş bırakılamaz.";
  } else {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      errors.email = "Bu email adresi zaten kullanılıyor.";
    }
  }

  if (!password || password.trim() === "") {
    errors.password = "Şifre boş bırakılamaz.";
  }

  return errors;
};
