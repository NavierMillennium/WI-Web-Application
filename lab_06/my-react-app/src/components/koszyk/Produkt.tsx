type Props = {
  nazwa: String
}

export default function Produkt({nazwa}: Props){
    return  <li>{nazwa}</li>
}
