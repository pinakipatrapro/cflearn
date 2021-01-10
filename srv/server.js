const express = require('express')
const app = express()
const SapCfAxios = require('sap-cf-axios').default;
const xsenv = require('@sap/xsenv');
const bodyParser = require('body-parser');

xsenv.loadEnv();
const services = xsenv.getServices({
    hana: { tag: 'hana' },
    uaa: { tag: 'xsuaa' }
});


const hdbext = require('@sap/hdbext');
app.use(hdbext.middleware(services.hana));

const xssec = require('@sap/xssec');
const passport = require('passport');
passport.use('JWT', new xssec.JWTStrategy(services.uaa));
app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));

app.use(bodyParser.json());

app.get('/srv/Product', async function (req, res) {

    const axios = SapCfAxios("northwind");
    var response = await axios({
        method: "GET",
        url: "/V2/Northwind/Northwind.svc/Customers",
        params: {
            $format: "json"
        }
    });
    var responseProd = await axios({
        method: "GET",
        url: "/V2/Northwind/Northwind.svc/Products",
        params: {
            $format: "json"
        }
    });
    res.send([...response.data.d.results,...responseProd.data.d.results])

})
app.get('/srv/sales', function (req, res) {
    req.db.exec('SELECT * FROM "nodetrial1.db::sales"', function (err, results) {
        if (err) {
            res.type('text/plain').status(500).send('ERROR: ' + err.toString());
            return;
        }
        res.status(200).json(results);
    });
});
app.listen(process.env.PORT || 5001)