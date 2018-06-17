CREATE DEFINER
=`root`@`localhost` PROCEDURE `createUser`
(IN p_userJSON   JSON,
															IN p_googleEmail  varchar
(64),
                                                            IN p_ipCountry				varchar
(3),
                                                            IN p_eventId                    varbinary
(16),
                                                            OUT p_return_text       varchar
(256),
                                                            OUT p_return_code    integer)
BEGIN

DECLARE v_email		varchar(64);
DECLARE v_cnt          integer;
DECLARE v_userId    varbinary(16);

set  p_return_code
= 10;

-- check user
If JSON_EXTRACT(p_userJSON, "$.googleEmail") = p_googleEmail then

set  p_return_code
= 20;
-- continue	

-- check if exists
set v_cnt
=
(select count(googleEmail)
from user
where googleEmail = p_googleEmail);

If v_cnt = 0 then
-- insert new user
INSERT INTO `elepig`.`user`
					(`
email`,
`lastName
`,
					`firstName`,
					`dateCreated`,
					`dateRegistered`,
					`dateLoggedIn`,
					`GDPRConsent`,
					`GDPRConsentLastGiven`,
					`registered`,
					`active`,
					`kyc`,
					`profileName`,
					`referralLink`,
					`lastJsonIn`,
					`googleEmail`,
                    eligibilityStatus,
                    eligibilityDate,
                    termsAgreed,
                    termsAgreedDate,
                    ipCountry
                    )
					VALUES
(JSON_EXTRACT
( p_userJSON, "$.googleEmail") ,
					JSON_EXTRACT
( p_userJSON, "$.lastName") ,
					JSON_EXTRACT
(p_userJSON, "$.firstName") ,
					curtime
(),
					curtime
(),
					curtime
(),
					JSON_EXTRACT
(p_userJSON, "$.GDPRInitialConsent") ,
                    Case JSON_EXTRACT
(p_userJSON, "$.GDPRInitialConsent") 
						When true then now
()
						Else null
End,
					1,
                    1,
                    0,
                    JSON_EXTRACT
(p_userJSON, "$.profileName") ,
                    '',
					p_userJSON,
					JSON_EXTRACT
(p_userJSON, "$.googleEmail"),
                    JSON_EXTRACT
(p_userJSON, "$.eligibilityStatus"),
                    Case JSON_EXTRACT
(p_userJSON, "$.eligibilityStatus")
						When true then now
()
						Else null
End,
                    JSON_EXTRACT
(p_userJSON, "$.termsAgreed"),
                    Case JSON_EXTRACT
(p_userJSON, "$.termsAgreed")
						When true then now
()
						Else null
End,
                    p_ipCountry
                    );


-- check user and write log
Select userId
into v_userId
from `elepig
`.`user`
                    where googleEmail = p_googleEmail;



set p_return_text
= 'User details inserted for supplied google account';
set p_return_code
= 0;
       
       CALL `elepig`.`createLog`
('createUser', p_return_text, 'success', p_return_code, v_userId, p_eventId);


	Elseif v_cnt = 1 then
-- update existing user

set v_userId
=
(select userId
from user
where googleEmail = p_googleEmail);

UPDATE `elepig`.`user`
SET
`email` = JSON_EXTRACT
(p_userJSON, "$.email") ,
					`lastName` = JSON_EXTRACT
(p_userJSON, "$.lastName") ,
					`firstName` = JSON_EXTRACT
(p_userJSON, "$.firstNamel") ,
					`dateLoggedIn` = now
(),
					`GDPRConsent` = JSON_EXTRACT
(p_userJSON, "$.GDPRInitialConsent") ,
					`GDPRConsentLastGiven` = now
(),
					`registered` = 1,
					`active` = 1,
					`profileName` =JSON_EXTRACT
(p_userJSON, "$.profileName") ,
					`lastJsonIn` = p_userJSON,
                    ipCountry = p_ipCountry
					WHERE `userID` = v_userId;

set p_return_text
= 'User details updated for supplied google account';
set p_return_code
= 0;
       
       CALL `elepig`.`createLog`
('createUser', p_return_text, 'success', p_return_code, v_userId, v_eventId);
       
    Else
-- return error
set p_return_text
= 'ERROR - Multiple user records found for supplied google account';
set p_return_code
= 99;
       
       CALL `elepig`.`createLog`
('createUser', p_return_text, 'error', p_return_code, v_userId, v_eventId);

End
if;


End
if;
select p_return_text, p_return_code;

END