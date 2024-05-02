import { useEffect, useState } from "react";

useEffect(() => {
    axios.get('/api/test')
      .then(res => console.log(res))
  })

const [inputData, setInputData] = useState([{
    id: '',
    category_name: ''
}])

function product(){


}

export default product;