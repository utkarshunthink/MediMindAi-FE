// curl --location 'https://api.anthropic.com/v1/messages' \
// --header 'x-api-key: apikey' \
// --header 'anthropic-version: 2023-06-01' \
// --header 'content-type: application/json' \
// --data '{
//     "model": "claude-3-5-sonnet-20240620",
//     "max_tokens": 1024,
//     "messages": [
//         {
//             "role": "user",
//             "content": "provide me some general inputs on medicides in prescription format in strict json for the below symtops:  '\''piles'\''along with precautions and home remedies along with one key if doctor consultation is required for the symtops if they are serious in boolean only in strict json no extra details with this (you are giving doctorconsultation required true for every symtops please suggest the duration after which it is required)"
//         }
//     ]
// }'