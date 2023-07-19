require("dotenv").config();
const os = require('os')
process.env.UV_THREADPOOL_SIZE = os.cpus().length;

const models = require('./models/index');
const { Op } = require("sequelize");
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
// const csrf = require('csurf');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const time_ago = require('timeago.js');
// const fileUpload = require('express-fileupload');
const useragent = require('express-useragent')
const Str = require('@supercharge/strings')
// const helmet = require("helmet");

const routes = require('./routes/index');

const app = express();

const hbs = require('hbs');
const fs = require('fs');
const { nextTick } = require('process');
const { resolve } = require('path');

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: 'GET,PUT,POST,OPTIONS, DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}

const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const MySQLStore = require('express-mysql-session')(session);
const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');
const helperQuery = require("./helpers/HelperQuery");
const helperFunctions = require("./helpers/HelperFunctions");

const port = process.env.PORT;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.text({ type: '/' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
// app.use(csrf({ cookie: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));
// app.use(fileUpload());
app.use(useragent.express());
// app.use(helmet());

const options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const sessionStore = new MySQLStore(options);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  store: sessionStore,
  saveUninitialized: true,
  // cookie: { secure: true } //for https
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
})

app.use(async function (req, res, next) {
  if (req.isAuthenticated() && req.user.account_type == 'admin') {
    const admin = await helperQuery.credQuery("Admin", "findOne", {
      where: { id: req.user.admin_id }
    });
    res.locals.admin = admin;
    next();
  } else {
    next();
  }
});

app.use('/', routes);

// ADMIN LOCAL STRATEGY
passport.use('admin', new LocalStrategy({
  passReqToCallback: true
},
  async function (req, username, password, done) {

    if (!username || !password) { return done(null, false, req.flash('return', 'All fields are required.')); }

    const checkAdmin = await helperQuery.credQuery("Admin", "findOne", {
      where: { email: username }
    });

    if (checkAdmin === null) {
      return done(null, false, req.flash('return', 'Invalid email or password.'));
    } else {
      const hash = checkAdmin.password.toString();
      const response = await bcryptjs.compare(password, hash);
      if (response === true) { // is password correct
        if (checkAdmin.accountStatus == 0) {
          const adminLog = {
            uId: checkAdmin.id,
            ipAddress: (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim(),
            browserAgent: req.useragent.source
          }
          const adminLogAudit = adminLog;
          adminLogAudit.pageRoute = req.originalUrl;
          adminLogAudit.actionPerformed = "Logged into account";
          await Promise.all([
            helperFunctions.addLoginAudit(adminLog),
            helperFunctions.addPageAudit(adminLogAudit)
          ]);
          // CHECK IF LOGIN DEVICE EXIST ELSE INSERT TO DB
          const newDevice = adminLog;
          newDevice.deviceUniqueID = await helperFunctions.randomString(12, "string");
          newDevice.deviceOS = os.platform();
          const checkDeviceLogin = await helperQuery.credQuery("loginDevices", "findOrCreate", {
            defaults: {
              uId: newDevice.uId,
              ipAddress: newDevice.ipAddress,
              deviceUniqueID: newDevice.deviceUniqueID,
              deviceOS: newDevice.deviceOS,
              browserAgent: newDevice.browserAgent,
              status: 1,
            },
            where: {
              [Op.and]: [
                { uId: newDevice.uId },
                { ipAddress: newDevice.ipAddress },
                // { browserAgent: newDevice.browserAgent }
              ]
            }
          });
          if (checkDeviceLogin) {
            const lastLogin = newDevice.lastLogin = await helperFunctions.formattedDateTime();
            if (lastLogin) {
              await helperQuery.updateQuery("loginDevices", "update",
                { lastLogin: newDevice.lastLogin },
                {
                  where: { deviceUniqueID: newDevice.deviceUniqueID }
                });
            }
          }
          // CHECK IF DEVICE IS APPROVED
          const isApproved = await helperQuery.credQuery("loginDevices", "findOne", {
            where: {
              [Op.and]: [
                { uId: adminLog.uId },
                { ipAddress: adminLog.ipAddress }
              ]
            }
          });
          if (isApproved.status != 1) {
            return done(null, false, req.flash('return', 'Device is not approved for login.'));
          }
          return done(null, {
            admin_id: checkAdmin.id,
            role: checkAdmin.role,
            position: checkAdmin.position,
            accountStatus: checkAdmin.accountStatus,
            blockAccess: checkAdmin.blockAccess,
            account_type: 'admin'
          });
        } else {
          return done(null, false, req.flash('return', 'Account Lockout: Contact Admin to reactivate your account.'));
        }
      } else { // invalid password
        return done(null, false, req.flash('return', 'Invalid email or password.'));
      }
    }
  }
));

// 404 Error
app.use(function (req, res) {
  res.status(404).render('404.hbs', {
    title: '400',
  });
});

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('500.hbs', {
//     title: '500',
//   });
// });


// Handlebars default config
const partialsDir = __dirname + '/views/partials';
const filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  const matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  const name = matches[1];
  const template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

//LOGIC HELPERS
hbs.registerHelper('ifNot', function (arg1, arg2, options) {
  return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('discount', function (arg1, arg2, options) {
  let ans = arg1 * arg2;
  return (arg2 - ans);
});


hbs.registerHelper('time_ago', function (arg1, options) {
  return (time_ago.format(arg1));
});

hbs.registerHelper('str_length', function (arg1, options) {
  return (Str(arg1).limit(25, '...').get());
});

hbs.registerHelper('count', function (arg1, options) {
  return (arg1.length);
});

hbs.registerHelper('date_time', function (arg1, options) {
  const format = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return (arg1.toLocaleDateString("en-NG", format));
});

hbs.registerHelper('fullDateTime', function (arg1, options) {
  return (arg1.getFullYear() + "-" + (arg1.getMonth() + 1) + '-' + arg1.getDate() + ' ' + arg1.getHours() + "-" + arg1.getMinutes() + '-' + arg1.getSeconds());
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

module.exports = app;