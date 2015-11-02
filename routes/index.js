
import imgRenderer from './img';

export default function(app) {

    app.get('/', (req, res) => res.render('home'));

    app.get([
        '/:width([0-9]{1,})x:height([0-9]{1,})',
        '/:width([0-9]{1,})',
    ], imgRenderer);


    return;
};
