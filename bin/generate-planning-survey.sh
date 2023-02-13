# CREATING TOPIC
curl --request POST \
  --url http://127.0.0.1:3001/topics \
  --header 'Accept: */*' \
  --header 'Accept-Language: en,es-ES;q=0.9,es;q=0.8' \
  --header 'Cache-Control: no-cache' \
  --header 'Connection: keep-alive' \
  --header 'Content-Type: application/json' \
  --header 'Origin: http://localhost:3000' \
  --header 'Pragma: no-cache' \
  --header 'Referer: http://localhost:3000/' \
  --header 'Sec-Fetch-Dest: empty' \
  --header 'Sec-Fetch-Mode: cors' \
  --header 'Sec-Fetch-Site: cross-site' \
  --header 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36' \
  --header 'sec-ch-ua: "Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"' \
  --header 'sec-ch-ua-mobile: ?0' \
  --header 'sec-ch-ua-platform: "macOS"' \
  --header 'token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiY2F0YWxpbmFAY2l2aWNvbmVjdGEuY2wiLCJuYW1lIjoiQ2F0YWxpbmEiLCJyb2xlIjoiQWRtaW5pc3RyYXRvciIsImFjdGl2ZSI6MX0sImlhdCI6MTY3NjI1MzQxMiwiZXhwIjoxNjc2ODU4MjEyfQ.GvBtzRKJnu-SBjV4bOWvNYVVrRDVLtlizr6uoo1pt80' \
  --cookie token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiY2F0YWxpbmFAY2l2aWNvbmVjdGEuY2wiLCJuYW1lIjoiQ2F0YWxpbmEiLCJyb2xlIjoiQWRtaW5pc3RyYXRvciIsImFjdGl2ZSI6MX0sImlhdCI6MTY3NjIzOTI4NiwiZXhwIjoxNjc2ODQ0MDg2fQ.5r1cHcLrNmSimzbikKPQDfqxK2rFYehRDn2_5vrCwT0 \
  --data '{
	"number": 1,
	"title": "categoria 1"
}'

# CREATING UNIT
curl 'http://127.0.0.1:3001/units' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en,es-ES;q=0.9,es;q=0.8' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://localhost:3000' \
  -H 'Pragma: no-cache' \
  -H 'Referer: http://localhost:3000/' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: cross-site' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoiY2F0YWxpbmFAY2l2aWNvbmVjdGEuY2wiLCJuYW1lIjoiQ2F0YWxpbmEiLCJyb2xlIjoiQWRtaW5pc3RyYXRvciIsImFjdGl2ZSI6MX0sImlhdCI6MTY3NjI1NDkxNSwiZXhwIjoxNjc2ODU5NzE1fQ.8Bi_IQG1u_kEySO5gIBLVghIafWZenyUsPUvqubIztU' \
  --data-raw '{"number":"1","title":"unidad 1","description":"descripcion 1","grade":"5º basico","topic":1}' \
  --compressed
