//import library
const express = require("express"); // import library express
const bodyParser = require("body-parser"); // import library body-parser untuk mengambil data dari body request
const auth = require("../auth"); // import fungsi auth
const { Op } = require("sequelize"); // import operator sequelize

//implementasi library
const app = express(); // inisialisasi express
app.use(bodyParser.json()); // inisialisasi body-parser
app.use(bodyParser.urlencoded({ extended: true })); // inisialisasi body-parser

//import model
const model = require("../models/index"); // import model
const detail_transaksi = model.detail_transaksi; // inisialisasi model detail_transaksi

// mengambil semua data detail_transaksi
app.get("/getAllData", auth, async (req, res) => { // endpoint untuk mengambil semua data detail_transaksi
  await detail_transaksi
    .findAll() // mengambil semua data detail_transaksi
    .then((result) => { // jika berhasil
      res.status(200).json({ // mengembalikan response dengan status code 200 dan data detail_transaksi
        status: "success",
        data: result,
      });
    })
    .catch((error) => { // jika gagal
      res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
});

// get data by id detail_transaksi
app.get("/getById/:id", auth, async (req, res) => { // endpoint untuk mengambil data detail_transaksi berdasarkan id detail_transaksi
  await detail_transaksi
    .findByPk(req.params.id) // mengambil data detail_transaksi berdasarkan id detail_transaksi yang dikirimkan melalui parameter
    .then((result) => { // jika berhasil
      if (result) {
        res.status(200).json({ // mengembalikan response dengan status code 200 dan data detail_transaksi
          status: "success",
          data: result,
        });
      } else { // jika data tidak ditemukan
        res.status(404).json({ // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
          status: "error",
          message: "data tidak ditemukan",
        });
      }
    })
    .catch((error) => { // jika gagal
      res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
});

// create detail_transaksi
app.post("/create", async (req, res) => { // endpoint untuk menambahkan data detail_transaksi
  const data = { // inisialisasi data yang akan dimasukkan
    id_transaksi: req.body.id_transaksi,
    id_menu: req.body.id_menu,
    harga: req.body.harga,
  };

  await detail_transaksi
    .create(data) // menambahkan data detail_transaksi
    .then((result) => { // jika berhasil
      res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan detail_transaksi berhasil ditambahkan
        status: "success",
        message: "detail transaksi berhasil ditambahkan",
        data: result,
      });
    })
    .catch((error) => { // jika gagal
      res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
});

// delete detail_transaksi
app.delete("/delete/:id_detail_transaksi", auth, async (req, res) => { // endpoint untuk menghapus data detail_transaksi
  const param = { id_detail_transaksi: req.params.id_detail_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter

  detail_transaksi
    .destroy({ where: param }) // menghapus data detail_transaksi berdasarkan id detail_transaksi yang dikirimkan melalui parameter
    .then((result) => { // jika berhasil
      if (result) { // jika data ditemukan
        res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan detail_transaksi berhasil dihapus
          status: "success",
          message: "detail transaksi berhasil dihapus",
          data: param,
        });
      } else { // jika data tidak ditemukan
        res.status(404).json({  // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
          status: "error",
          message: "data tidak ditemukan",
        });
      }
    })
    .catch((error) => { // jika gagal
      res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
});

// edit detail_transaksi
app.patch("/edit/:id_detail_transaksi", auth, async (req, res) => { // endpoint untuk mengubah data detail_transaksi
  const param = { id_detail_transaksi: req.params.id_detail_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter
  const data = { // inisialisasi data yang akan diubah
   id_transaksi: req.body.id_transaksi,
   id_menu: req.body.id_menu,
   harga: req.body.harga,
  };

  detail_transaksi.findOne({ where: param }).then((result) => { // mengambil data detail_transaksi berdasarkan id detail_transaksi yang dikirimkan melalui parameter
    if (result) { // jika data ditemukan
      detail_transaksi
        .update(data, { where: param }) // mengubah data detail_transaksi berdasarkan id detail_transaksi yang dikirimkan melalui parameter
        .then((result) => { // jika berhasil
          res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan data berhasil diubah
            status: "success",
            message: "data berhasil diubah",
            data: {
              id_detail_transaksi: param.id_detail_transaksi,
              ...data,
            },
          });
        })
        .catch((error) => { // jika gagal
          res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
            status: "error",
            message: error.message,
          });
        });
    } else { // jika data tidak ditemukan
      res.status(404).json({ // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
        status: "error",
        message: "data tidak ditemukan",
      });
    }
  });
});

module.exports = app; // export module app