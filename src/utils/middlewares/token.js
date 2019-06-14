import UidGen from 'uid-generator';
const uidgen = new UidGen(256);

const uid = () => {
  return uidgen.generate();
};

export default uid;