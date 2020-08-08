var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
	extended: false
}));

app.listen(process.env.PORT || 3000);
//Connect Mongo
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://infore:yN2riQYI8m4tJ5eP@cluster0.umh5g.mongodb.net/Infore?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}, function (err) {
	if (err) {
		console.log("Mongo connect error!!!");
	}
	else {
		console.log("Mongo connceted!!!")
	}
});
//Models
var Inter = require('./Models/intership');

//multer
var multer = require('multer');
const intership = require('./Models/intership');
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/upload')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname)
	}
});
var upload = multer({
	storage: storage,
	fileFilter: function (req, file, cb) {
		console.log(file);
		if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/gif") {
			cb(null, true)
		}
		else {
			return cb(new Error('Only image are allowed!'))
		}
	}
}).single("imgName");

//Home Page
app.get('/', function (req, res) {
	res.render('index', {
		title: 'Trang chủ'
	})
});

//Them
app.get('/add', function (req, res) {
	res.render('add', {
		title: 'Thêm dữ liệu thực tập sinh',
	});
})

app.post('/add', function (req, res) {
	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			console.log("Có lỗi multer tải dữ liệu lên.");
		}
		else if (err) {
			res.send("Ảnh quá lớn hoặc không đúng định dạng cho phép!!!" + err);
			console.log("" + err);
		}
		else {
			//    res.send(req.file.filename);
			var intership = Inter({
				Name: req.body.txtName,
				Linkfb: req.body.txtLinkFb,
				Sex: req.body.txtSex,
				BirthDay: req.body.txtBirthDay,
				PhoneNum: req.body.txtPhoneNum,
				Email: req.body.txtEmail,
				///	// Img: req.file.filename
			});
			intership.save(function (err) {
				if (err) {
					res.json({
						"kq": 0,
						"errMsg": err
					});
				}
				else {
					res.redirect('./list');
				}

			})
		}
	})
})
//danh sach
app.get('/list', function (req, res) {
	Inter.find(function (err, data) {
		if (err) {
			res.json({
				'kq': 0,
				'errMsg': err
			});
		}
		else {
			res.render('list', {
				danhsach: data,
				title: 'Dánh sách thực tập sinh'
			});
		}
	})
})

// sửa
app.get("/edit/:id", function (req, res) {
	// Lấy thông tin chi tiết của đối tương theo ID
	Inter.findById(req.params.id, function (err, interres) {
		if (err) {
			res.send("co loi")
		}
		else {
			res.render('edit', {
				title: 'Sửa thông tin',
				thuctapsinh: interres
			});

		}
		console.log(interres);
	});
})

app.post('/edit', function (req, res) {
	//update thong tin
	upload(req, res, function (err) {
		console.log(req.body);
		if (err instanceof multer.MulterError) {
			console.log("Có lỗi multer tải dữ liệu lên.");
		}
		else if (err) {
			res.send("Ảnh quá lớn hoặc không đúng định dạng cho phép!!!" + err);
			console.log("" + err);
		}
		else {
			Inter.updateOne({
				_id: req.body.txtHidden
			}, {
				Name: req.body.txtName,
				Linkfb: req.body.txtLinkFb,
				Sex: req.body.txtSex,
				BirthDay: req.body.txtBirthDay,
				PhoneNum: req.body.txtPhoneNum,
				Email: req.body.txtEmail
			}, function (err) {
				if (err) {
					console.log("Lỗi")
				}
				else {
					res.redirect("./list")
				}

			})
		}

	})
})

//xóa
app.get("/delete/:id", function (req, res) {
	// Lấy thông tin chi tiết của đối tương theo ID
	Inter.deleteOne({
		_id: req.params.id
	}, function (err) {
		if (err) {
			res.send("co loi")
		}
		else {
			res.redirect('../list')
		}
	})
})