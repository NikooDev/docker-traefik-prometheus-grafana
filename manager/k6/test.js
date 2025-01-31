import http from 'k6/http';
import { check, sleep } from 'k6';

// Définition de l'URL cible pour le test de montée en charge
const BASE_URL = 'https://traefik.nikolasdev.com'; // Remplacez par l'URL de votre service cible

const CERT = `-----BEGIN CERTIFICATE-----
MIIGOTCCBSGgAwIBAgIRALV/PYKW2zcLUbB1l7EZbkMwDQYJKoZIhvcNAQELBQAw
gY8xCzAJBgNVBAYTAkdCMRswGQYDVQQIExJHcmVhdGVyIE1hbmNoZXN0ZXIxEDAO
BgNVBAcTB1NhbGZvcmQxGDAWBgNVBAoTD1NlY3RpZ28gTGltaXRlZDE3MDUGA1UE
AxMuU2VjdGlnbyBSU0EgRG9tYWluIFZhbGlkYXRpb24gU2VjdXJlIFNlcnZlciBD
QTAeFw0yNTAxMDgwMDAwMDBaFw0yNjAxMDgyMzU5NTlaMBsxGTAXBgNVBAMMECou
bmlrb2xhc2Rldi5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDr
5VO+2Fm5W0JihzfdPxtucYv+u9jPnL1ICQi5N1tOxYCpJ/jueJXXDWv0kPrUttrW
NS5ClbKYoykGhImIVaMwYCMTt9JSuh7RBHL/4dWSc/DQXyyxiGpL45RgF4Ez+P0u
JAu/wGU/7ovTwQDifw4n+iou5ZXyKx0EA3fY3a/tX7uwl9t5y7+OR6ii4QNivkZP
Jzag5u4IuPI5QiXchSGjbkJWqWT+Kw5FNa+GtLlafiCs6GxDmdrbc6bjNLmW0Cyj
RoN25njahOmtaKeWvs4iZ+TG/F3un/QqtBucY+bzAnxE1putDMLoTIMUf9fj4jhd
iz88k9vzGxDJN43YZ7hNAgMBAAGjggMBMIIC/TAfBgNVHSMEGDAWgBSNjF7EVK2K
4Xfpm/mbBeG4AY1h4TAdBgNVHQ4EFgQUPhRaTtwRJ4Qop8L7fLWRON7DE3gwDgYD
VR0PAQH/BAQDAgWgMAwGA1UdEwEB/wQCMAAwHQYDVR0lBBYwFAYIKwYBBQUHAwEG
CCsGAQUFBwMCMEkGA1UdIARCMEAwNAYLKwYBBAGyMQECAgcwJTAjBggrBgEFBQcC
ARYXaHR0cHM6Ly9zZWN0aWdvLmNvbS9DUFMwCAYGZ4EMAQIBMIGEBggrBgEFBQcB
AQR4MHYwTwYIKwYBBQUHMAKGQ2h0dHA6Ly9jcnQuc2VjdGlnby5jb20vU2VjdGln
b1JTQURvbWFpblZhbGlkYXRpb25TZWN1cmVTZXJ2ZXJDQS5jcnQwIwYIKwYBBQUH
MAGGF2h0dHA6Ly9vY3NwLnNlY3RpZ28uY29tMIIBfQYKKwYBBAHWeQIEAgSCAW0E
ggFpAWcAdgCWl2S/VViXrfdDh2g3CEJ36fA61fak8zZuRqQ/D8qpxgAAAZRE/tQ1
AAAEAwBHMEUCIGiA+LZ9xBvN2cLvV1s+GI5RZDLq30e24y1FgPSX/X2eAiEA0jfC
5V1EPQ/aUfDUULnodrQXieSkJVFxl0E7mSr8wp4AdgAZhtTHKKpv/roDb3gqTQGR
qs4tcjEPrs5dcEEtJUzH1AAAAZRE/tPCAAAEAwBHMEUCIED9g1wOjXdNdqc9gO5j
ntpSrWcWwOhxH5DekOFVGaSSAiEAkBcjL3Vu92ykgOrC9MXpNgNrtJNcC9HLVtyo
BolnqW0AdQDLOPcViXyEoURfW8Hd+8lu8ppZzUcKaQWFsMsUwxRY5wAAAZRE/tPs
AAAEAwBGMEQCIETYfmW3aX/tRqk0rsID+V8DhBKM7VS53Imn70yEq22iAiBHUea6
aps63I0a7vwSNaCPvPFoR09CmcUereunrr5CITArBgNVHREEJDAighAqLm5pa29s
YXNkZXYuY29tgg5uaWtvbGFzZGV2LmNvbTANBgkqhkiG9w0BAQsFAAOCAQEATSyc
FKyBEzceuciZKhe/ns93OikmBl31/XLAydcIQXBRV407U+pKjazvDD6Evaoz+iUR
75kNK4ObBRrVt6VIII7m8c2GGyDz4OmdhUwEdTjR54dLL+VwWc97v2k+ZRhaetls
HYQ5KsvHd3dy3CeNBMmJe74YPreqfDIbqTUoocArtVgCr+e85+guDSzUfeUtDTF7
aEe8gMavZtCDJ9BWS9lktj5L5lLqgLx4j0p+nzT6PPwS2aVdi4W/gHkhtjFTj/J1
5tgmfmuTAiLO8WrhOg3L2P/cvWfKCMaNQ+teXzoPvcJ/0/sUjBFMBqLelApcIhgI
oNVy/sVpDqb/Noi7/A==
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIGEzCCA/ugAwIBAgIQfVtRJrR2uhHbdBYLvFMNpzANBgkqhkiG9w0BAQwFADCB
iDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCk5ldyBKZXJzZXkxFDASBgNVBAcTC0pl
cnNleSBDaXR5MR4wHAYDVQQKExVUaGUgVVNFUlRSVVNUIE5ldHdvcmsxLjAsBgNV
BAMTJVVTRVJUcnVzdCBSU0EgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkwHhcNMTgx
MTAyMDAwMDAwWhcNMzAxMjMxMjM1OTU5WjCBjzELMAkGA1UEBhMCR0IxGzAZBgNV
BAgTEkdyZWF0ZXIgTWFuY2hlc3RlcjEQMA4GA1UEBxMHU2FsZm9yZDEYMBYGA1UE
ChMPU2VjdGlnbyBMaW1pdGVkMTcwNQYDVQQDEy5TZWN0aWdvIFJTQSBEb21haW4g
VmFsaWRhdGlvbiBTZWN1cmUgU2VydmVyIENBMIIBIjANBgkqhkiG9w0BAQEFAAOC
AQ8AMIIBCgKCAQEA1nMz1tc8INAA0hdFuNY+B6I/x0HuMjDJsGz99J/LEpgPLT+N
TQEMgg8Xf2Iu6bhIefsWg06t1zIlk7cHv7lQP6lMw0Aq6Tn/2YHKHxYyQdqAJrkj
eocgHuP/IJo8lURvh3UGkEC0MpMWCRAIIz7S3YcPb11RFGoKacVPAXJpz9OTTG0E
oKMbgn6xmrntxZ7FN3ifmgg0+1YuWMQJDgZkW7w33PGfKGioVrCSo1yfu4iYCBsk
Haswha6vsC6eep3BwEIc4gLw6uBK0u+QDrTBQBbwb4VCSmT3pDCg/r8uoydajotY
uK3DGReEY+1vVv2Dy2A0xHS+5p3b4eTlygxfFQIDAQABo4IBbjCCAWowHwYDVR0j
BBgwFoAUU3m/WqorSs9UgOHYm8Cd8rIDZsswHQYDVR0OBBYEFI2MXsRUrYrhd+mb
+ZsF4bgBjWHhMA4GA1UdDwEB/wQEAwIBhjASBgNVHRMBAf8ECDAGAQH/AgEAMB0G
A1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAbBgNVHSAEFDASMAYGBFUdIAAw
CAYGZ4EMAQIBMFAGA1UdHwRJMEcwRaBDoEGGP2h0dHA6Ly9jcmwudXNlcnRydXN0
LmNvbS9VU0VSVHJ1c3RSU0FDZXJ0aWZpY2F0aW9uQXV0aG9yaXR5LmNybDB2Bggr
BgEFBQcBAQRqMGgwPwYIKwYBBQUHMAKGM2h0dHA6Ly9jcnQudXNlcnRydXN0LmNv
bS9VU0VSVHJ1c3RSU0FBZGRUcnVzdENBLmNydDAlBggrBgEFBQcwAYYZaHR0cDov
L29jc3AudXNlcnRydXN0LmNvbTANBgkqhkiG9w0BAQwFAAOCAgEAMr9hvQ5Iw0/H
ukdN+Jx4GQHcEx2Ab/zDcLRSmjEzmldS+zGea6TvVKqJjUAXaPgREHzSyrHxVYbH
7rM2kYb2OVG/Rr8PoLq0935JxCo2F57kaDl6r5ROVm+yezu/Coa9zcV3HAO4OLGi
H19+24rcRki2aArPsrW04jTkZ6k4Zgle0rj8nSg6F0AnwnJOKf0hPHzPE/uWLMUx
RP0T7dWbqWlod3zu4f+k+TY4CFM5ooQ0nBnzvg6s1SQ36yOoeNDT5++SR2RiOSLv
xvcRviKFxmZEJCaOEDKNyJOuB56DPi/Z+fVGjmO+wea03KbNIaiGCpXZLoUmGv38
sbZXQm2V0TP2ORQGgkE49Y9Y3IBbpNV9lXj9p5v//cWoaasm56ekBYdbqbe4oyAL
l6lFhd2zi+WJN44pDfwGF/Y4QA5C5BIG+3vzxhFoYt/jmPQT2BVPi7Fp2RBgvGQq
6jG35LWjOhSbJuMLe/0CjraZwTiXWTb2qHSihrZe68Zk6s+go/lunrotEbaGmAhY
LcmsJWTyXnW0OMGuf1pGg+pRyrbxmRE1a6Vqe8YAsOf4vmSyrcjC8azjUeqkk+B5
yOGBQMkKW+ESPMFgKuOXwIlCypTPRpgSabuY0MLTDXJLR27lk8QyKGOHQ+SwMj4K
00u/I5sUKUErmgQfky3xxzlIPK1aEn8=
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIFgTCCBGmgAwIBAgIQOXJEOvkit1HX02wQ3TE1lTANBgkqhkiG9w0BAQwFADB7
MQswCQYDVQQGEwJHQjEbMBkGA1UECAwSR3JlYXRlciBNYW5jaGVzdGVyMRAwDgYD
VQQHDAdTYWxmb3JkMRowGAYDVQQKDBFDb21vZG8gQ0EgTGltaXRlZDEhMB8GA1UE
AwwYQUFBIENlcnRpZmljYXRlIFNlcnZpY2VzMB4XDTE5MDMxMjAwMDAwMFoXDTI4
MTIzMTIzNTk1OVowgYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpOZXcgSmVyc2V5
MRQwEgYDVQQHEwtKZXJzZXkgQ2l0eTEeMBwGA1UEChMVVGhlIFVTRVJUUlVTVCBO
ZXR3b3JrMS4wLAYDVQQDEyVVU0VSVHJ1c3QgUlNBIENlcnRpZmljYXRpb24gQXV0
aG9yaXR5MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAgBJlFzYOw9sI
s9CsVw127c0n00ytUINh4qogTQktZAnczomfzD2p7PbPwdzx07HWezcoEStH2jnG
vDoZtF+mvX2do2NCtnbyqTsrkfjib9DsFiCQCT7i6HTJGLSR1GJk23+jBvGIGGqQ
Ijy8/hPwhxR79uQfjtTkUcYRZ0YIUcuGFFQ/vDP+fmyc/xadGL1RjjWmp2bIcmfb
IWax1Jt4A8BQOujM8Ny8nkz+rwWWNR9XWrf/zvk9tyy29lTdyOcSOk2uTIq3XJq0
tyA9yn8iNK5+O2hmAUTnAU5GU5szYPeUvlM3kHND8zLDU+/bqv50TmnHa4xgk97E
xwzf4TKuzJM7UXiVZ4vuPVb+DNBpDxsP8yUmazNt925H+nND5X4OpWaxKXwyhGNV
icQNwZNUMBkTrNN9N6frXTpsNVzbQdcS2qlJC9/YgIoJk2KOtWbPJYjNhLixP6Q5
D9kCnusSTJV882sFqV4Wg8y4Z+LoE53MW4LTTLPtW//e5XOsIzstAL81VXQJSdhJ
WBp/kjbmUZIO8yZ9HE0XvMnsQybQv0FfQKlERPSZ51eHnlAfV1SoPv10Yy+xUGUJ
5lhCLkMaTLTwJUdZ+gQek9QmRkpQgbLevni3/GcV4clXhB4PY9bpYrrWX1Uu6lzG
KAgEJTm4Diup8kyXHAc/DVL17e8vgg8CAwEAAaOB8jCB7zAfBgNVHSMEGDAWgBSg
EQojPpbxB+zirynvgqV/0DCktDAdBgNVHQ4EFgQUU3m/WqorSs9UgOHYm8Cd8rID
ZsswDgYDVR0PAQH/BAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8wEQYDVR0gBAowCDAG
BgRVHSAAMEMGA1UdHwQ8MDowOKA2oDSGMmh0dHA6Ly9jcmwuY29tb2RvY2EuY29t
L0FBQUNlcnRpZmljYXRlU2VydmljZXMuY3JsMDQGCCsGAQUFBwEBBCgwJjAkBggr
BgEFBQcwAYYYaHR0cDovL29jc3AuY29tb2RvY2EuY29tMA0GCSqGSIb3DQEBDAUA
A4IBAQAYh1HcdCE9nIrgJ7cz0C7M7PDmy14R3iJvm3WOnnL+5Nb+qh+cli3vA0p+
rvSNb3I8QzvAP+u431yqqcau8vzY7qN7Q/aGNnwU4M309z/+3ri0ivCRlv79Q2R+
/czSAaF9ffgZGclCKxO/WIu6pKJmBHaIkU4MiRTOok3JMrO66BQavHHxW/BBC5gA
CiIDEOUMsfnNkjcZ7Tvx5Dq2+UUTJnWvu6rvP3t3O9LEApE9GQDTF1w52z97GA1F
zZOFli9d31kWTz9RvdVFGD/tSo7oBmF0Ixa1DVBzJ0RHfxBdiSprhTEUxOipakyA
vGp4z7h/jnZymQyd/teRCBaho1+V
-----END CERTIFICATE-----`;

const KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEA6+VTvthZuVtCYoc33T8bbnGL/rvYz5y9SAkIuTdbTsWAqSf4
7niV1w1r9JD61Lba1jUuQpWymKMpBoSJiFWjMGAjE7fSUroe0QRy/+HVknPw0F8s
sYhqS+OUYBeBM/j9LiQLv8BlP+6L08EA4n8OJ/oqLuWV8isdBAN32N2v7V+7sJfb
ecu/jkeoouEDYr5GTyc2oObuCLjyOUIl3IUho25CVqlk/isORTWvhrS5Wn4grOhs
Q5na23Om4zS5ltAso0aDduZ42oTprWinlr7OImfkxvxd7p/0KrQbnGPm8wJ8RNab
rQzC6EyDFH/X4+I4XYs/PJPb8xsQyTeN2Ge4TQIDAQABAoIBAChTDGzMSRIxcnir
SrZsakEH8fl6nQZoccbVnIMk3lvp0SOZbKk/PcYESlcFTYt9Mo15i83gDyaehY3S
rDv8/6duV7CwNKjlngz26L2rGjotzZWhH1+9xQXyAlQm0HRU9NqlWMjPl79FBOwO
yxrswzu8POfFYUuDaTNdcGhHBSLbbY1EAVLHJhuZpdA4jNGRtKNaZ7YODxpOkyJo
RLxjpPdVgwD5S7ibRDDeKKo5UnXMJMK/mTEjMmfZ/CtIRx7VFZbh4e/FMwcgKmi1
ca4Ikposhk3sPxwQXrvEFy3lwUaUHdr4si3ZBGPmUVS4Qa9Vg4XrBm0Rlq8/RGtn
pzwpNEECgYEA+3k3ri6gjUlcgtOj4lYF27p7ycPznddW24IS95KAFHR30WwIfTJF
cUlUjmrsnx2qKuDBAEc9PSQnO4btwJKo9QUlOYjpov/S1iB1ofFF6PoqitNdZJlr
x5LRnhAuWL+KM5bC+72sSIFQ40ItYRp9ujhoaXIu+2bqEIxCxPLw4j0CgYEA8CRT
+98v1nWke5485lHg4Xkn8GIQGhieuaqnGYZ/aR0VDcE9Da+KAhLh5OMoOJqYQrGR
7ooqlTEEWMbGkEmXv7gZ0hV+c3NKUg0ONLVkxY9dCOlk3PHcBQMg67CcxQNWLiXf
OVJROycNa4PFDXnGaaNIttkh878JOZQtR9xh31ECgYBGULWuAaGo/+tbNXxsrCsF
LpawaxcyemTyCePtz8v6bDqYl0GkaCscqyl2jRVOxIexZ5jvz/uinfpOXcMbBqcx
o9etx8e0aR31+6uItaMbqt+8Y6+IkpGdg0MTlGixLhWhqTUqGPYUa/xHH1j6/uJK
8LzZRzE14KfwKpf85AVQ7QKBgHpye6RdfF4FJHaoC/OA4oL1rSjER+OWlDCl1IiO
bR8i5h5aXxBAZsWB7U8xiMu8AFFZi8ivCOGD2eyOhqcB72+hpwDZVt31dnr6DzlP
GPAnls+5emWyqXagzsN/DaDjf6kORJFM6QCZfB1LVkn1wvcQfD5H3ykTStfiN2iB
9iHRAoGAN6Tt9QblzzhySr+ygrC8zJisZ4rsrk5HHMnOeEckFdPnAB7xBb3lmWGs
uufqS1ErYU7bjPG4Dd0IHwRZfOUrGgzvwU384rkx4aDS3PSkIM/IDyZ1peKk4xnV
ePtw63bUE0oCtt2G2PsEsryR5mU6lpcrwCjX1vIv9uVYIrc1moI=
-----END RSA PRIVATE KEY-----`;

// Configuration de la montée en charge : nombre d'utilisateurs virtuels et durée du test
export const options = {
	tlsAuth: [
		{
			domains: ['nikolasdev.com'],
			cert: CERT,
			key: KEY,
		},
	],
	stages: [
		{ duration: '30s', target: 10 },  // Monte à 10 utilisateurs sur 30 secondes
		{ duration: '1m', target: 50 },   // Monte à 50 utilisateurs sur 1 minute
		{ duration: '1m', target: 100 },  // Monte à 100 utilisateurs sur 1 minute
		{ duration: '2m', target: 100 },  // Maintient 100 utilisateurs pendant 2 minutes
		{ duration: '30s', target: 0 },   // Réduit progressivement à 0 utilisateurs en 30 secondes
	],
};

// Le test lui-même
export default function () {
	// Envoi d'une requête HTTP GET à l'URL cible
	const res = http.get(BASE_URL);
	
	// Vérification que la réponse est correcte (status 200)
	check(res, {
		'status est 200': (r) => r.status === 200,
		'temps de réponse inférieur à 200ms': (r) => r.timings.duration < 200,
	});
	
	// Simulation d'un temps de pause (sleep) entre les requêtes pour simuler un comportement plus réaliste des utilisateurs
	sleep(1); // Attente de 1 seconde entre chaque requête
}
