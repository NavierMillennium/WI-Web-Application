from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
import base64


private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
public_key = private_key.public_key()


public_pem = public_key.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)

private_pem = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.TraditionalOpenSSL,
    encryption_algorithm=serialization.NoEncryption()
)


def pem_to_jwk(pub_key: rsa.RSAPublicKey):
    numbers = pub_key.public_numbers()
    e = numbers.e
    n = numbers.n

    def long_to_base64(x:int):
        return base64.urlsafe_b64encode(x.to_bytes((x.bit_length() + 7) // 8, 'big')).rstrip(b"=").decode('utf-8')

    jwk = {
        "kty": "RSA",
        "use": "sig",
        "alg": "RS256",
        "kid": "core-key",
        "n": long_to_base64(n),
        "e": long_to_base64(e)
    }
    return jwk


