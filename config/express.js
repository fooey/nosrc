
import morgan from 'morgan';
import errorHandler from 'errorhandler';
import favicon from 'serve-favicon';


export default function(app, express) {

    app.set('env', (process.env.NODE_ENV === 'development') ? 'development': 'production');


    /*
    *
    * Middleware
    *
    */

    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', './views');
    app.set('view engine', 'jade');


    if (app.get('env') === 'development') {
        app.use(errorHandler({ dumpExceptions: true, showStack: true }));
        app.locals.pretty = true;
        app.use(morgan('dev'));
    }
    else {
        app.use(errorHandler());
        app.use(morgan('combined'));
        app.set('view cache', true);
    }



    app.use(
        favicon('./public/favicon.ico')
    );





    var staticOptions = {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    };

    app.use(express.static('./public', staticOptions));
};

