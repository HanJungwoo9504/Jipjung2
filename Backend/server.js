var express = require('express');
var app = express();
var ejs = require('ejs');
var http = require('http').Server(app); //1
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mysql = require('mysql');
var idConfirm1 = 0;

app.set('view engine', 'html');

http.listen(3001, function() {
  console.log('server on!');
});

io.sockets.on('connection', function(socket) {
  console.log('user connected: ', socket.id);

  var msg;
  var roomname;
  var tmp;

  socket.on('join', function(text) {
    socket.join(text.roomname);
    connection.query('SELECT * from chattingRoomInfo', function(err, rows, fields) {
      if (!err) {
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].title == text.roomname) {
            tmp = rows[i].roomnum;
            console.log(tmp);
            connection.query('UPDATE chattingRoomInfo SET roomnum=? WHERE title=?', [tmp + 1, text.roomname], function(err, rows, fields) {
              if (!err) {
                console.log('Chatting Room Entered');
              } else
                console.log('Error while performing Query.', err);
            });
          }
        }
      } else
        console.log('Error while performing Query.', err);
    });

    io.sockets.in(text.roomname).emit('enter', text);
  });

  socket.on('message', function(text) {
    msg = text;
    console.log(text.key);

    connection.query('Insert into chattingList(title, chatting, userkey, emotion) values(?, ?, ?, ?)', [text.roomname, text.message, text.key, text.profile], function(err, rows1, fields) { //id정보로 채팅방 찾는 기능 추가
      if (!err) {

      } else
        console.log('Error while performing Query.', err);
    });

    roomname = text.roomname;
    io.sockets.in(text.roomname).emit('receiveMsg', msg);
  });

  socket.on('leave', function(text) {
    socket.leave(text.roomname);
    connection.query('SELECT * from chattingRoomInfo', function(err, rows, fields) {
      if (!err) {
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].title == text.roomname) {
            tmp = rows[i].roomnum;
            connection.query('UPDATE chattingRoomInfo SET roomnum=? WHERE title=?', [tmp - 1, text.roomname], function(err, rows, fields) {
              if (!err) {
                console.log('Chatting Room Exit');
                text.roomnum = tmp - 1;
              } else
                console.log('Error while performing Query.', err);
            });
          }
        }
      } else
        console.log('Error while performing Query.', err);
    });
    console.log(text);
    io.sockets.in(text.roomname).emit('exit', text);
  })

  socket.on('disconnect', function() {
    console.log('user disconnected: ', socket.id);
  })
});

var connection = mysql.createConnection({
  //connectionLimit: 10,
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'USERproject11!',
  database: 'userListDB',
  debug: false
});

app.use(bodyParser.json());

app.get('/', function(req, res) {
  console.log("Hello GominHanjan");
  res.send("GominHanjan");
});

app.get('/test/:position', function(req, res) {
  //받은 position 수많큼 객체를 생성해서 JSON 배열로 리턴
  var position = req.params.position;
  console.log(position);
  var strArray = position.split(',');
  var id = strArray[0];
  var password = strArray[1];
  var results = new Array;
  var login = 0;

  if (id == []) {
    if (password == []) {
      results.push({
        id: 2,
        name: 0,
        trust: 0,
        emotion: 0
      });
      console.log(results);
      res.json(results);
    } else {
      results.push({
        id: 3,
        name: 0,
        trust: 0,
        emotion: 0
      });
      console.log(results);
      res.json(results);
    }
  } else if (id != [] && password == []) {
    results.push({
      id: 4,
      name: 0,
      trust: 0,
      emotion: 0
    });
    console.log(results);
    res.json(results);
  } else {
    connection.query('SELECT * from userList', function(err, rows, fields) {
      if (!err) {
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].id == id && rows[i].password == password) {
            console.log('Login');
            login = 1;
            results.push({
              id: 1,
              name: rows[i].name,
              trust: rows[i].trust,
              emotion: rows[i].emotion
            });
          }
        }
        if (login == 0) {
          console.log('Not Login');
          results.push({
            id: 0,
            name: 0,
            trust: 0,
            emotion: 0
          });
        }
        console.log(results);
        res.json(results);
      } else
        console.log('Error while performing Query.', err);
    });
  }
});

app.get('/test1/:signup', function(req, res) {
  var signup = req.params.signup;
  var strArray1 = signup.split(',');
  console.log(signup);
  var name = strArray1[0];
  var sex = strArray1[1];
  var age = strArray1[2];
  var id = strArray1[3];
  var password1 = strArray1[4];
  var password2 = strArray1[5];
  var userkey = 0;
  var signup = 0;
  var emotion = 0;
  var results = new Array();

  if (name == []) {
    results.push({
      id: 2
    });
    console.log(results);
    res.json(results);
  } else if (sex == []) {
    results.push({
      id: 3
    });
    console.log(results);
    res.json(results);
  } else if (age == []) {
    results.push({
      id: 4
    });
    console.log(results);
    res.json(results);
  } else if (id == []) {
    results.push({
      id: 5
    });
    console.log(results);
    res.json(results);
  } else if (password1 == []) {
    results.push({
      id: 6
    });
    console.log(results);
    res.json(results);
  } else if (password2 == []) {
    results.push({
      id: 7
    });
    console.log(results);
    res.json(results);
  } else if (password1 != password2) {
    results.push({
      id: 8
    });
    console.log(results);
    res.json(results);
  } else {
    connection.query('SELECT * from userList', function(err, rows, fields) {
      if (!err) {
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].id == id) {
            console.log('Same ID');
            signup = 1;
            results.push({
              id: 1
            });
            res.json(results);
          }
        }

        userkey = rows.length;

        if (signup == 0 && idConfirm1 == 1) {
          connection.query('Insert into userList(name, sex, age, id, password, trust, userkey, emotion) values(?, ?, ?, ?, ?, ?, ?, ?)', [name, sex, age, id, password1, '0', userkey + 1, emotion], function(err, result) {
            if (err) throw err;
            console.log('Registered');
            idConfirm1 = 0;
            results.push({
              id: 0
            });
            console.log(results);
            res.json(results);
          });
        } else if (idConfirm1 == 0) {
          results.push({
            id: 9
          });
          res.json(results);
        }
      } else
        console.log('Error while performing Query.', err);

    });
  }
});

app.get('/test2/:idconfirm', function(req, res) {
  var id = req.params.idconfirm;
  var idConfirm = 0;
  var results = new Array();
  console.log(id);
  connection.query('SELECT * from userList', function(err, rows, fields) {
    if (!err) {
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].id == id) {
          console.log('Same ID');
          idConfirm = 1;
          results.push({
            id: 1
          });
        }
      }

      if (idConfirm == 0) {
        idConfirm1 = 1;
        results.push({
          id: 0
        });
      }

      res.json(results);
    } else
      console.log('Error while performing Query.', err);
  });
});

app.get('/chat/:chattingroominfo', function(req, res) {
  var chattingroominfo = req.params.chattingroominfo;
  var strArray1 = chattingroominfo.split(',');
  var roomname = strArray1[0];
  var maintext = strArray1[1];
  var category = strArray1[2];
  var agemin = strArray1[3];
  var agemax = strArray1[4];
  var sex = strArray1[5];
  var trust = strArray1[6];
  var user_id = strArray1[7];
  var user_password = strArray1[8];
  var emotion = strArray1[9];
  var userkey;
  var results = new Array();
  console.log(roomname);
  connection.query('SELECT * from userList', function(err, rows, fields) {
    if (!err) {
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].id == user_id) {
          userkey = rows[i].userkey;
        }
      }
    } else
      console.log('Error while performing Query.', err);
  });

  connection.query('Insert into chattingRoomList(category, agemin, agemax, sex, trust, title) values(?, ?, ?, ?, ?, ?)', [category, agemin, agemax, sex, trust, roomname], function(err, result) {
    if (err) throw err;
    console.log('Room Created');

    connection.query('Insert into chattingRoomInfo(title, maintext, id, category, emotion, like1, roomnum) values(?, ?, ?, ?, ?, ?, ?)', [roomname, maintext, user_id, category, emotion, '0', 0], function(err, rows1, fields) { //id정보로 채팅방 찾는 기능 추가
      if (!err) {
        console.log('Text is saved');
        results.push({
          id: 0,
          userkey: userkey
        });
        console.log(results);
        res.json(results);
      } else
        console.log('Error while performing Query.', err);
    });
  });
});

app.get('/post1/:readpost', function(req, res) {
  var chattingroomid = req.params.readpost;
  var results = new Array();

  connection.query('SELECT * from chattingRoomInfo', function(err, rows, fields) {
    if (!err) {
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].title == chattingroomid) {
          results.push({
            id: rows[i].maintext,
            userkey: rows[i].id
          });
          res.json(results);
        }
      }
    } else
      console.log('Error while performing Query.', err);
  });


});

app.get('/chattinginfo/:chattinginfo', function(req, res) {
  var chattinginfo = req.params.chattinginfo;
  console.log(chattinginfo);
  var age, sex, trust;
  var age1, sex1;
  var title = new Array();
  var results = new Array();

  connection.query('SELECT * from userList', function(err, rows, fields) {
    if (!err) {
      for (var i = 0; i < rows.length; i++) {
        if (chattinginfo == rows[i].id) {
          age = rows[i].age;
          sex = rows[i].sex;
          trust = rows[i].trust;
        }
      }
    } else
      console.log('Error while performing Query.', err);
  });

  connection.query('SELECT * from chattingRoomList', function(err, rows1, fields) {
    if (!err) {
      age = parseInt(age);
      for (var i = 0; i < rows1.length; i++) {
        if (rows1[i].sex == '남자') {
          sex1 = 0;
        } else if (rows1[i].sex == '여자') {
          sex1 = 1;
        } else if (rows1[i].sex == '모두') {
          sex1 = sex;
        }
        if (age >= parseInt(rows1[i].agemin) && age <= parseInt(rows1[i].agemax)) {
          if (sex == sex1) {
            if (trust >= rows1[i].trust) {
              title.push(rows1[i].title);
            }
          }
        }
      }
    } else
      console.log('Error while performing Query.', err);
  });

  connection.query('SELECT * from chattingRoomInfo', function(err, rows, fields) {
    if (!err) {
      for (var i = 0; i < title.length; i++) {
        for (var j = 0; j < rows.length; j++) {
          if (title[i] == rows[j].title) {
            results.push({
              id: rows[j].like1,
              name: rows[j].title,
              trust: rows[j].category,
              emotion: rows[j].emotion
            });
          }
        }
      }
      console.log(results);
      res.json(results);
    } else
      console.log('Error while performing Query.', err);
  });
});

app.get('/userkey/:userkey', function(req, res) {
  var userkey = req.params.userkey;
  var strArray = userkey.split(',');
  var id = strArray[0];
  var password = strArray[1];
  var userkey1;
  var results = new Array();

  connection.query(`SELECT userkey from userList where id='${id}' and password='${password}'`, function(err, rows, fields) {
    if (!err) {
      results.push({
        id: rows[0].userkey
      });
      res.json(results);
    } else
      console.log('Error while performing Query.', err);
  });
});

app.get('/emotion/:emotion', function(req, res) {
  var emotion = req.params.emotion;
  var strArray = emotion.split(',');
  var id = strArray[0];
  var emotion = strArray[1];
  var results = new Array();

  connection.query('UPDATE userList SET emotion=? WHERE id=?', [emotion, id], function(err, rows, fields) {
    if (!err) {
      console.log('Emotion Changed');
      results.push({
        id: 0
      });
      res.json(results);
    } else
      console.log('Error while performing Query.', err);
  });
});

app.get('/usertitle/:usertitle', function(req, res) {
  var userid = req.params.usertitle;
  console.log(userid);
  var results = new Array();

  connection.query('SELECT * from chattingRoomInfo', function(err, rows, fields) {
    if (!err) {
      for (var i = 0; i < rows.length; i++) {
        if (userid == rows[i].id) {
          results.push({
            id: rows[i].title,
            name: rows[i].category,
            trust: rows[i].emotion,
            emotion: rows[i].like1
          });
        }
      }
      console.log(results);
      res.json(results);
    } else
      console.log('Error while performing Query.', err);
  });
});

app.get('/like/:like', function(req, res) {
  var like1 = req.params.like;
  var strArray = like1.split(',');
  var title = strArray[0];
  var like = strArray[1];
  var results = new Array();
  console.log(like);

  connection.query('UPDATE chattingRoomInfo SET like1=? WHERE title=?', [like, title], function(err, rows, fields) {
    if (!err) {
      console.log('Like!');
      results.push({
        id: 0
      });
      res.json(results);
    } else
      console.log('Error while performing Query.', err);
  });
});

app.get('/favorite/:favorite', function(req, res) {
  var favorite = req.params.favorite;
  var strArray = favorite.split(',');
  var id = strArray[0];
  var title = strArray[1];
  var tmp = 0;
  var results = new Array();

  connection.query('SELECT * from favoriteList', function(err, rows, fields) {
    if (!err) {
      for (var i = 0; i < rows.length; i++) {
        if (id == rows[i].id && title == rows[i].title) {
          tmp = 1;
          results.push({
            id: 1
          });
          console.log(results);
          console.log('Already added');
          res.json(results);
          break;
        }
      }
      if (tmp == 0) {
        connection.query('INSERT INTO favoriteList(id, title) VALUES(?, ?)', [id, title], function(err, rows, fields) {
          if (!err) {
            results.push({
              id: 0
            });
            res.json(results);
          } else
            console.log('Error while performing Query.', err);
        });
      }
    } else
      console.log('Error while performing Query.', err);
  });
});

app.get('/favoritelist/:favoritelist', function(req, res) {
  var id = req.params.favoritelist;
  var results = new Array();

  connection.query('SELECT * from favoriteList', function(err, rows, fields) {
    if (!err) {
      for (var i = 0; i < rows.length; i++) {
        if (id == rows[i].id) {
          results.push({
            id: rows[i].title
          });
        }
      }
      console.log(results);
      res.json(results);
    } else
      console.log('Error while performing Query.', err);
  });
});

app.get('/trust/:trust', function(req, res) {
  var id = req.params.trust;
  var strArray = id.split(',');
  var userkey1 = strArray[0];
  var userkey2 = strArray[1];
  var tmp = strArray[2];
  var trust;
  var results = new Array();
  console.log(tmp);

  if (userkey1 == userkey2) {
    results.push({
      id: 0
    });
    res.json(results);
  } else {
    connection.query('SELECT * from userList', function(err, rows, fields) {
      if (!err) {
        for (var i = 0; i < rows.length; i++) {
          if (userkey1 == rows[i].userkey) {
            trust = rows[i].trust;
            console.log(trust);
            if (tmp == "신뢰도 UP!") {
              connection.query('UPDATE userList SET trust=? WHERE userkey=?', [parseInt(trust) + 1, userkey1], function(err, rows, fields) {
                if (!err) {
                  results.push({
                    id: 1
                  });
                  console.log(results);
                  res.json(results);
                } else
                  console.log('Error while performing Query.', err);
              });
            } else if (tmp == "신뢰도 DOWN") {
              connection.query('UPDATE userList SET trust=? WHERE userkey=?', [parseInt(trust) - 1, userkey1], function(err, rows, fields) {
                if (!err) {
                  results.push({
                    id: 2
                  });
                  console.log(results);
                  res.json(results);
                } else
                  console.log('Error while performing Query.', err);
              });
            }
          }
        }
      } else
        console.log('Error while performing Query.', err);
    });
  }
});

app.get('/trust1/:trust1', function(req, res) {
  var id = req.params.trust1;
  var results = new Array();
  console.log(id);
  connection.query('SELECT * from userList', function(err, rows, fields) {
    if (!err) {
      for (var i = 0; i < rows.length; i++) {
        if (id == rows[i].id) {
          results.push({
            id: rows[i].trust
          });
          res.json(results);
        }
      }
    } else
      console.log('Error while performing Query.', err);
  });
});

app.get('/profile/:profile', function(req, res) {
  var profile = req.params.profile;
  var results = new Array();
  console.log(profile);

  connection.query('SELECT * from userList', function(err, rows, fields) {
    if (!err) {
      for (var i = 0; i < rows.length; i++) {
        if (profile == rows[i].userkey) {
          results.push({
            id: rows[i].emotion,
            title: rows[i].userkey,
            maintext: rows[i].trust
          });
          res.json(results);
        }
      }
    } else
      console.log('Error while performing Query.', err);
  });

});

app.get('/chattinglist/:chattinglist', function(req, res) {
  var title = req.params.chattinglist;
  var results = new Array();
  console.log(title);

  connection.query('SELECT * from chattingList', function(err, rows, fields) {
    if (!err) {
      for (var i = 0; i < rows.length; i++) {
        if (title == rows[i].title) {
          results.push({
            id: rows[i].chatting,
            title: rows[i].userkey,
            maintext: rows[i].emotion
          });
        }
      }
      res.json(results);
    } else
      console.log('Error while performing Query.', err);
  });

});

app.get('/chattingnum/:chattingnum', function(req, res) {
  var chattingnum = req.params.chattingnum;
  var results = new Array();
  console.log(chattingnum);

  connection.query('SELECT * from chattingRoomInfo', function(err, rows, fields) {
    if (!err) {
      for (var i = 0; i < rows.length; i++) {
        if (chattingnum == rows[i].title) {
          results.push({
            id: rows[i].roomnum
          });
        }
      }
      res.json(results);
    } else
      console.log('Error while performing Query.', err);
  });

});
