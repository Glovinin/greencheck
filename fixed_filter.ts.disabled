// Função para filtrar noites válidas do período selecionado
const getFilteredNightlyPrices = () => {
  if (!date.from || !date.to || nightlyPrices.length === 0) return [];
  
  console.log("🗓️ Filtrando noites para o período:", {
    checkIn: date.from.toISOString(),
    checkOut: date.to.toISOString(),
    totalNights: differenceInDays(date.to, date.from)
  });
  
  // Gerar as noites correspondentes ao período (começando pelo check-in até antes do check-out)
  const checkIn = new Date(date.from);
  const checkOut = new Date(date.to);
  checkIn.setHours(0, 0, 0, 0);
  checkOut.setHours(0, 0, 0, 0);
  
  const stayDates: string[] = [];
  const currentDate = new Date(checkIn);
  
  while (currentDate < checkOut) {
    stayDates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  console.log("📅 Datas de estadia exatas:", stayDates);
  console.log("💼 Preços disponíveis:", nightlyPrices);
  
  // Filtrar apenas as noites que correspondem às datas de estadia
  const filtered = nightlyPrices.filter(night => stayDates.includes(night.date));
  
  console.log("✅ Noites filtradas:", filtered);
  
  return filtered;
}
