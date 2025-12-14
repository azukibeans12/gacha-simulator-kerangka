import React, {useState, useEffect} from 'react';
import './App.css';

//Item untuk gacha
const ITEMS = [
  { name: 'Pel Lantai Aroma Amis Khas Warteg', color: '#ffd700', rarity: 0.05 },
  { name: 'Toples Khong Guan Isi Rengginang Alot', color: '#ff0055', rarity: 0.15 },
  { name: 'Sapu Milik Ibu Tetangga', color: '#4da6ff', rarity: 0.30 },
  { name: 'Botol Sampo Isi Air Kocokan Sisa-sisa', color: '#888', rarity: 0.50 }
];

//Main App Component
function App() {
  const [money, setMoney] = useState(() => Number(localStorage.getItem('bal')) || 0);
  const [inventory, setInventory] = useState(() => JSON.parse(localStorage.getItem('inv')) || []);
  const [lastRoll, setLastRoll] = useState(null);
  
  //State untuk uang
  const [billPos, setBillPos] = useState({ top: 20, left: 20, rot: 0 });
  const [billVisible, setBillVisible] = useState(true);

  useEffect(() => {
    localStorage.setItem('bal', money);
    localStorage.setItem('inv', JSON.stringify(inventory));
  }, [money, inventory]);

  //Fungsi mengambil uang
  const collectMoney = () => {
    if (!billVisible) return;

    setMoney(m => m + 100000);
    setBillVisible(false); //Uang hilang

    //Uang muncul lagi
    setTimeout(() => {
      setBillPos({
        top: 10 + Math.random() * 70, //acak posisi
        left: 10 + Math.random() * 70, 
        rot: Math.random() * 360
      });
      setBillVisible(true);
    }, 1500);
  };


  //gacha
  const roll = () => {
    if (money < 100000) return alert("Uang tidak cukup.");
    setMoney(m => m - 100000);
    const rng = Math.random();
    let cumulative = 0;
    for (const item of ITEMS) {
      cumulative += item.rarity;
      if (rng <= cumulative) {
        setLastRoll(item);
        setInventory(prev => [item, ...prev]);
        break;
      }
    }
  };

  //hapus dari inventory
  const deleteItem = (idx) => setInventory(inv => inv.filter((_, i) => i !== idx));

  //duit
  return (
    <div className="wrapper">
      {billVisible && (
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Indonesia_2004_100000r_o.jpg"
          className="duit"
          onClick={collectMoney}
          style={{ 
            top: `${billPos.top}%`, 
            left: `${billPos.left}%`, 
            transform: `rotate(${billPos.rot}deg)` 
          }}
          alt="100k rupiah"
        />
      )}
  
      {/*Kotak tengah*/}
      <main className="gacha-card">
        <div className="uang">Uang: <span>Rp {money.toLocaleString()}</span></div>
        
        <div className="display-box">
          {lastRoll ? (
            <div className="result" style={{ borderColor: lastRoll.color }}>
              <h2 style={{ color: lastRoll.color }}>{lastRoll.name}</h2>
            </div>
          ) : <span className="placeholder">Ambil duit untuk gacha.</span>}
        </div>

        <button className="roll-btn" onClick={roll}>gacha (100k)</button>

        <div className="inventory-section">
          <h3>Stash ({inventory.length})</h3>
          <div className="inventory-list">
            {inventory.map((item, i) => (
              <div key={i} className="inv-item">
                <span style={{ color: item.color }}>• {item.name}</span>
                <button className="del-btn" onClick={() => deleteItem(i)}>×</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;