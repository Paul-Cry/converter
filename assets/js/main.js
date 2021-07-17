let app = new Vue({
  el: '#app',
  data:{
    courses: null, // храниться data из fetch
    coursesMas: [], // массив получаемый и api ЦБ
    meta: [], // массив из монет которые расположенны на главном экране 
    search: '', // храниться занчение вписанное для поиска валюты 
    CoinMas: [],  // маccив созданные для фильтрации валют 
    currentCoin: { // Текущая валюта 
      index: null, // индекс 
      coin: {
        name: null
      }, // Объект хранящий валюту 
    },
    windList: false, // Храниться булевое значение для условия с классом
    coin: {
      get: 5000, // храниться число которое вписал пользователь
      give: null // храниться число значение умножения курса валюты на чилсло введённое пользователем
    },
    curs: '',
    emaill: {
      status: true,
      value: '',
      check: '',
    }
  },
  mounted(){
    this.getCurses()
    this.currentCoin.index = 0

    this.currentCoin.coin.name = 'AUD'
    document.querySelector('.box-email__button').disabled = this.emaill.status
    window.addEventListener('load', ()=>{
      document.querySelector('.loader').style.display = 'none'
    })
  
  },
  methods:{
    //Получаю курсы валют с api цб  
    getCurses(){
        fetch('https://www.cbr-xml-daily.ru/daily_json.js')
        .then(res => res.json())
        .then((data)=>{
          this.courses = data
          for(let key in this.courses.Valute){
            this.coursesMas.push({name : key, details: this.courses.Valute[key]})
          }
          this.meta = this.coursesMas.slice(0, 3);
          this.currentCoin.coin = this.meta[0]
          //Вызываю фунция для подсчёта курса
          this.operationCoin()
         
          //После тог окак создался массив coursesMas передаются все зачения 
          // в filterCoin для фильтрации
          this.CoinMas = this.coursesMas

        }) 
    },
    //При помощи filter сравнивается что вписал пользователь 
    //с название монеты и формиуется новый массив
    filterCoin(){
      let list = document.querySelector('.box-list__scroll')
      this.CoinMas = this.coursesMas.filter((item)=>{
        return item.name.indexOf(this.search.toUpperCase()) !== -1
        })
      //Условие что если валют будет меньше чем 20 то делается одну колону
      if(this.CoinMas.length < 20){
        list.style.gridTemplateColumns = '1fr'
      }else{
        list.style.gridTemplateColumns = '1fr 1fr '
      }
    },
    //Здесь отслеживается текущиая валюта 
      getCurrentCoin(index){
      this.currentCoin.coin = this.CoinMas[index]
      this.windList = false
      //Заменяю валюту в главном блоке 
      this.meta.splice(this.currentCoin.index, 1, this.currentCoin.coin);
      this.operationCoin()
     
    },
    //Вычисляется курс 
    operationCoin(i){   
      if(i >= 0){
        this.currentCoin.index = i
        this.currentCoin.coin  = this.meta[i]
      }
      if(this.coin.get){
        this.curs = (this.currentCoin.coin.details.Nominal / this.currentCoin.coin.details.Value).toFixed(3)
        this.coin.give = Math.floor(this.coin.get * (this.currentCoin.coin.details.Nominal / this.currentCoin.coin.details.Value));
      }else{
        this.coin.give = ''
      }
      
    },
    //Валидация email
    checkEmail(){
      
        if(!this.emaill.value){
          this.emaill.status = true
        }else{
          this.emaill.status = false
        }
        //Если input пустой то блокирую кнопку
        document.querySelector('.box-email__button').disabled = this.emaill.status
    },
    //Post запрос для отправки email 
    sendMail(){
      let message = {
        emaill: this.emaill.value,
        coin: this.currentCoin.coin.name,
        value: {
          coinObj: this.coin
        }
      }
      app.emaill.value = ''
      fetch('http://localhost:3000/mail',{
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( message)
      }).then((data)=>{
        if(data.status == 200){
          this.emaill.check =  'right'
        }else{
          this.emaill.check =  'err'
        }
        setTimeout(()=>{
          this.emaill.check =  ''
        },2000)
      })
    }

  }
})




  



