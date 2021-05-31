package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	f "github.com/fauna/faunadb-go/v4/faunadb"
	log "github.com/sirupsen/logrus"
)

type deleteUrl struct {
	Short string `json:"short"`
}

type deleteResponse struct {
	Message string `json:"message"`
}

func RemoveURL(w http.ResponseWriter, r *http.Request) {
	var url deleteUrl
	err := json.NewDecoder(r.Body).Decode(&url)
	if err != nil {
		returnDeleteError(err, w)
	}

	key := os.Getenv("GO_FAUNA_SECRET_KEY_A")
	if key == "" {
		returnDeleteError(fmt.Errorf("missing GO_FAUNA_SECRET_KEY_A"), w)

	}
	client := f.NewFaunaClient(key)
	_, err = client.Query(
		f.Map(
			f.Paginate(f.MatchTerm(f.Index("url_short"), url.Short)),
			f.Lambda(
				"ref",
				f.Delete(f.Var("ref")),
			)))
	if err != nil {
		returnDeleteError(err, w)
	}

	msg, _ := json.Marshal(deleteResponse{Message: "successfully deleted"})
	fmt.Fprint(w, string(msg))
}

type deleteError struct {
	Error string `json:"error"`
}

func returnDeleteError(err error, w http.ResponseWriter) {
	errorGet := deleteError{
		Error: err.Error(),
	}
	msg, _ := json.Marshal(errorGet)
	w.WriteHeader(500)
	fmt.Fprint(w, string(msg))
	log.Fatal(err)
}
