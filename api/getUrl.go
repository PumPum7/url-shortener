package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	f "github.com/fauna/faunadb-go/v4/faunadb"
	log "github.com/sirupsen/logrus"
)


type URL struct {
	Short string `fauna:"short" json:"short"`
	Long string `fauna:"long" json:"long"`
	Usage int `fauna:"usage" json:"usage"`
	Password string `fauna:"password" json:"-"`
	Protected bool `json:"protected"`
}

type ShortURL struct {
	Short string `json:"url"`
}


func GetURL(w http.ResponseWriter, r *http.Request) {
	shortUrl := r.FormValue("url")
	if shortUrl == "" {
		returnError(fmt.Errorf("no url specified"), w)
	}

	key := os.Getenv("GO_FAUNA_SECRET_KEY_A")
	if (key == "") {
		returnError(fmt.Errorf("missing GO_FAUNA_SECRET_KEY_A"), w)

	}
	client := f.NewFaunaClient(key)

	res, err := client.Query(f.Get(f.MatchTerm(f.Index("url_short"), shortUrl)))
	if err != nil {
		returnError(err, w)
	}

	var url URL

	err = res.At(f.ObjKey("data")).Get(&url)
	if err != nil {
		returnError(err, w)
	}
	if url.Password != "" {
		url.Protected = true
	}

	msg, _ := json.Marshal(url)

	w.Header().Add("Content-Type", "application/json")
	fmt.Fprintf(w, string(msg))
}

func returnError(err error, w http.ResponseWriter) {
	fmt.Fprintf(w, err.Error())
	log.Fatal(err)
}