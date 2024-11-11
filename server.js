const express = require("express");
const path = require("path");
const sqlite3 = require("better-sqlite3");
const bcrypt = require("bcrypt");
const session = require("express-session");

const staticPath = path.join(__dirname, "/Frontend");

const app = express();

const db = new sqlite3("studietidDatabase");

app.use(session({
    secret: "login nøkkel",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000,
        secure: false,
        httpOnly: true,
    }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("Frontend"));

app.use("/", express.static(path.join(__dirname, "/Frontend/index.html")));
app.use("/studietid", express.static(path.join(__dirname, "/Frontend/studietid.html")));
app.use("/nyStudietime", express.static(path.join(__dirname, "/Frontend/ny studietime.html")));

app.post("/login", (req, res) => {
    const { bNavn, pOrd } = req.body;
    const user = db.prepare("SELECT * FROM Brukere WHERE epostAdresse = ?");
    const userAll = user.get(bNavn);

    if (user!=null) {
        const result = bcrypt.compareSync(pOrd, userAll.passord) 
            if (result) {
                req.session.loggedIn = true;
                req.session.bNavn = userAll.navn;
                req.session.user = userAll;

                res.redirect("/studietid");
            } else {
                res.status(401).send("Feil e-post adresse eller passord");
            }
    } else {
        res.status(401).send("Skriv inn en bruker");
    }
});

app.get("/studietid", (req, res) => {
    if (req.session.loggedIn) {
        res.sendFile(path.join(__dirname, "/Frontend/studietid.html"));
        res.sendFile(path.join(__dirname, "/Frontend/studietid ny.html"));
    } else {
        res.redirect("/index.html");
    }
});

app.get("/brukerInfo", (req, res) => {
    if (req.session.loggedIn) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ feil })
    }
});

app.listen(3000, () => {
    console.log("server is running on port http://localhost:3000");
});