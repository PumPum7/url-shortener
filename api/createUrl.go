package handler

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"time"

	f "github.com/fauna/faunadb-go/v4/faunadb"
	log "github.com/sirupsen/logrus"
)

type postUrl struct {
	Short          string    `fauna:"short" json:"short"`
	Long           string    `fauna:"long" json:"long"`
	Usage          int       `fauna:"usage" json:"usage"`
	Password       string    `fauna:"password" json:"password,omitempty"`
	Length         int       `json:"length" fauna:"-"`
	ExpirationTime int       `json:"expirationTime,omitempty" fauna:"-"`
	Expiration     time.Time `json:"expiration" fauna:"-"`
}

func CreateUrl(w http.ResponseWriter, r *http.Request) {
	var url postUrl
	err := json.NewDecoder(r.Body).Decode(&url)
	if err != nil {
		returnPostError(err, w)
	}

	length := 5
	if url.Length > 5 {
		length = url.Length
	}
	shortUrl := createShortUrl(length)
	url.Short = shortUrl

	key := os.Getenv("GO_FAUNA_SECRET_KEY_A")
	if key == "" {
		returnPostError(fmt.Errorf("missing GO_FAUNA_SECRET_KEY_A"), w)

	}
	client := f.NewFaunaClient(key)
	nowTime := time.Now().UTC()
	var expiration time.Time
	if url.ExpirationTime > 0 {
		expiration = nowTime.Add(time.Hour * time.Duration(url.ExpirationTime))
	}

	options := f.Obj{"data": url, "ttl": expiration}
	if url.ExpirationTime <= 0 {
		options = f.Obj{"data": url}
	}

	res, err := client.Query(f.Create(f.Collection("urls"), options))
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, "Error creating URL: %v", err)
	}

	err = res.At(f.ObjKey("data")).Get(&url)
	if err != nil {
		returnPostError(err, w)
	}

	url.Length = length
	url.Expiration = expiration
	msg, _ := json.Marshal(url)
	fmt.Fprint(w, string(msg))
}

func returnPostError(err error, w http.ResponseWriter) {
	w.WriteHeader(500)
	fmt.Fprint(w, err.Error())
	log.Fatal(err)
}

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

func createShortUrl(n int) string {
	rand.Seed(time.Now().UnixNano())
	b := make([]byte, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}
