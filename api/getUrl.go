package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	f "github.com/fauna/faunadb-go/v4/faunadb"
	log "github.com/sirupsen/logrus"
)

type getUrl struct {
	Short      string `fauna:"short" json:"short"`
	Long       string `fauna:"long" json:"long"`
	Usage      int    `fauna:"usage" json:"usage"`
	Password   string `fauna:"password" json:"-"`
	Protected  bool   `json:"protected"`
	Expiration int    `json:"expiration,omitempty"`
}

// TODO: add support for returning the expiration time

type ShortURL struct {
	Short string `json:"url"`
}

func GetURL(w http.ResponseWriter, r *http.Request) {
	shortUrl := r.FormValue("url")
	if shortUrl == "" {
		returnGetError(fmt.Errorf("no url specified"), w)
	}

	key := os.Getenv("GO_FAUNA_SECRET_KEY_A")
	if key == "" {
		returnGetError(fmt.Errorf("missing GO_FAUNA_SECRET_KEY_A"), w)

	}
	client := f.NewFaunaClient(key)

	res, err := client.Query(f.Get(f.MatchTerm(f.Index("url_short"), shortUrl)))
	if err != nil {
		returnGetError(err, w)
	}

	var url getUrl

	err = res.At(f.ObjKey("data")).Get(&url)
	if err != nil {
		returnGetError(err, w)
	}
	if url.Password != "" {
		url.Protected = true
	}

	msg, _ := json.Marshal(url)

	w.Header().Add("Content-Type", "application/json")
	fmt.Fprint(w, string(msg))
}

type getError struct {
	Error string `json:"error"`
}

func returnGetError(err error, w http.ResponseWriter) {
	errorGet := getError{
		Error: err.Error(),
	}
	msg, _ := json.Marshal(errorGet)
	w.WriteHeader(500)
	fmt.Fprint(w, string(msg))
	log.Fatal(err)
}
