import bcrypt from 'bcrypt';

const saltRounds = 10;

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Erro ao criptografar a senha: ' + error.message);
  }
};

const verifyPassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Erro ao verificar a senha: ' + error.message);
  }
};

export { hashPassword, verifyPassword };
