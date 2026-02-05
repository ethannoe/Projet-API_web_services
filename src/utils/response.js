const reponseSucces = (res, message, donnees = null, statut = 200) => {
  return res.status(statut).json({
    succes: true,
    message,
    donnees
  });
};

module.exports = { reponseSucces };
