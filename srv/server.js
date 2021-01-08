const express = require('express')
const app = express()
const SapCfAxios = require('sap-cf-axios').default;
const xsenv = require('@sap/xsenv');


app.get('/srv/Product', async function (req, res) {
    //   res.send(JSON.stringify(req.originalUrl))
            xsenv.loadEnv();

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

app.listen(process.env.PORT || 5001)