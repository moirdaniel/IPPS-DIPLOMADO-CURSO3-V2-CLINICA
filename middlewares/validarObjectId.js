// Los ids de MongoDB tienen 24 caracteres hexadecimales.
export const validarObjectId = (req, res, next) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) {
    return res.status(400).json({ error: 'El id no tiene un formato válido de MongoDB' })
  }
  next()
}
