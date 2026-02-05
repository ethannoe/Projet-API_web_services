const routeInconnue = (_req, _res, next) => {
  const erreur = new Error("Ressource introuvable.");
  erreur.statut = 404;
  next(erreur);
};

const gestionErreurGlobale = (err, _req, res, _next) => {
  const statut = err.statut || 500;

  if (err.name === "ValidationError") {
    return res.status(400).json({
      succes: false,
      message: "Erreur de validation des données.",
      details: Object.values(err.errors).map((element) => element.message)
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      succes: false,
      message: "Une valeur unique est déjà utilisée.",
      details: err.keyValue
    });
  }

  return res.status(statut).json({
    succes: false,
    message: err.message || "Erreur interne du serveur."
  });
};

module.exports = { gestionErreurGlobale, routeInconnue };
