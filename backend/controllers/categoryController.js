const Catogory=require('../models/Category');

class CatogoryController {
  static async getAllCatogory(req, res) {
    try {
      const catogory = await Catogory.getAllCatogory();
      res.status(200).json(catogory);
    } catch (err) {
      res.status(400).json(err);
    }
  }

  static async getcatogeryById(req, res) {
    const { id } = req.params;
    try {
      const catogory = await Catogory.getcatogeryById(id);
      res.status(200).json(catogory);
    } catch (err) {
      res.status(400).json(err);
    }
  }

  static async getEleAndToy(req, res) {
    try {
      const catogory = await Catogory.getEleAndToy();
      res.status(200).json(catogory);
    } catch (err) {
      res.status(400).json(err);
    }
  }

  
}
module.exports = CatogoryController;