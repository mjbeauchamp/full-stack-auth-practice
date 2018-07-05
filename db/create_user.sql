INSERT INTO users
(auth_id, user_name, user_pic)
VALUES
($1, $2, $3)
-- The return clause will immediately return the user that it just barely created
RETURNING *;