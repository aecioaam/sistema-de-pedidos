
import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  MapPin,
  CreditCard,
  MessageSquare,
  Send,
  Plus,
  Minus,
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  Lock,
  User,
  X,
  ChevronDown,
  Key,
  Banknote,
  Store
} from 'lucide-react';
import { Product, CartItem, OrderDetails, Neighborhood, PaymentMethod, Category, ProductOption } from './types';
import { supabase } from './src/services/supabase';
import {
  fetchProducts,
  fetchCategories,
  fetchNeighborhoods,
  fetchStoreSettings,
  subscribeToSettings,
  createOrder,
  signInWithEmail,
  signOut
} from './src/services/api';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  const [session, setSession] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [closedMessage, setClosedMessage] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState(1);
  const [isOrdered, setIsOrdered] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [selectedProductForOptions, setSelectedProductForOptions] = useState<Product | null>(null);

  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    customerName: '',
    type: 'entrega',
    paymentMethod: 'pix',
    customMessage: '',
    street: '',
    number: '',
    reference: '',
    changeFor: undefined
  });

  const loadData = async () => {
    const p = await fetchProducts();
    const c = await fetchCategories();
    const n = await fetchNeighborhoods();
    const s = await fetchStoreSettings();

    setProducts(p);
    // Sort categories by order
    const sortedCategories = c.sort((a, b) => (a.order || 0) - (b.order || 0));
    setCategories(sortedCategories);

    // Set initial active category
    if (sortedCategories.length > 0) {
      setActiveCategory(sortedCategories[0].name);
    }
    setNeighborhoods(n);
    if (s) {
      setIsStoreOpen(s.is_open);
      setClosedMessage(s.closed_message || '');
      setWhatsappNumber(s.whatsapp_number || '');
    }
  };

  useEffect(() => {
    loadData();

    // Auth Subscription
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session as any);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session as any);
    });

    // Realtime Settings Subscription
    const realTimeSub = subscribeToSettings((newSettings) => {
      setIsStoreOpen(newSettings.is_open);
      setClosedMessage(newSettings.closed_message);
      setWhatsappNumber(newSettings.whatsapp_number);
    });

    return () => {
      subscription.unsubscribe();
      realTimeSub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const categoryNames = useMemo(() => {
    return categories
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(c => c.name);
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.category === activeCategory && p.is_active !== false);
  }, [products, activeCategory]);

  const handleAddToCart = (product: Product, option?: ProductOption) => {
    const finalPrice = option?.price ?? product.price;
    setCart(prev => {
      const existing = prev.find(item =>
        item.id === product.id &&
        (item.selectedOption?.name === option?.name)
      );
      if (existing) {
        return prev.map(item =>
          (item.id === product.id && item.selectedOption?.name === option?.name)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, price: finalPrice, quantity: 1, selectedOption: option }];
    });
    setSelectedProductForOptions(null);
  };

  const updateQuantity = (id: string, optionName: string | undefined, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedOption?.name === optionName) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = orderDetails.type === 'entrega' && orderDetails.neighborhoodId
    ? (neighborhoods.find(n => n.id === orderDetails.neighborhoodId)?.fee || 0)
    : 0;
  const total = subtotal + deliveryFee;

  const handleTryLogin = async () => {
    const { error } = await signInWithEmail(emailInput, passwordInput);

    if (error) {
      alert("Erro ao entrar: " + error.message);
    } else {
      setShowAdminLogin(false);
      setEmailInput('');
      setPasswordInput('');
    }
  };

  const handleNewOrder = () => {
    setCart([]);
    setStep(1);
    setIsOrdered(false);
    setOrderDetails({
      customerName: '',
      type: 'entrega',
      paymentMethod: 'pix',
      customMessage: '',
      street: '',
      number: '',
      reference: '',
      changeFor: undefined
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalize = async () => {
    const neighborhood = neighborhoods.find(n => n.id === orderDetails.neighborhoodId);

    // 1. Save to Supabase
    try {
      await createOrder({
        customer_name: orderDetails.customerName,
        customer_phone: '', // Not collected in UI currently, maybe add later or leave empty
        neighborhood: neighborhood?.name,
        street: orderDetails.street,
        number: orderDetails.number,
        reference: orderDetails.reference,
        items: cart,
        total_value: total,
        payment_method: orderDetails.paymentMethod,
        change_for: orderDetails.changeFor,
        delivery_type: orderDetails.type,
        status: 'pendente',
        custom_message: orderDetails.customMessage
      });
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Houve um erro ao salvar o pedido no sistema, mas vamos prosseguir para o WhatsApp.');
    }

    // 2. Send to WhatsApp
    let msg = `*🍰 NOVO PEDIDO - DOCERIA*\n\n`;
    msg += `*Cliente:* ${orderDetails.customerName}\n\n`;
    msg += `*Itens:*\n`;
    cart.forEach(item => {
      const optionStr = item.selectedOption ? ` (${item.selectedOption.name})` : '';
      msg += `• ${item.quantity}x ${item.name}${optionStr} (R$ ${(item.price * item.quantity).toFixed(2)})\n`;
    });
    msg += `\n*Subtotal:* R$ ${subtotal.toFixed(2)}\n`;
    if (orderDetails.type === 'entrega') {
      msg += `*Tipo:* Entrega 🛵\n*Bairro:* ${neighborhood?.name || 'Não informado'}\n*Endereço:* ${orderDetails.street}, Nº ${orderDetails.number}\n`;
      if (orderDetails.reference) msg += `*Referência:* ${orderDetails.reference}\n`;
      msg += `*Taxa de Entrega:* R$ ${deliveryFee.toFixed(2)}\n`;
    } else {
      msg += `*Tipo:* Retirada 🏪\n`;
    }
    msg += `\n*Pagamento:* ${orderDetails.paymentMethod.toUpperCase()}\n`;
    if (orderDetails.paymentMethod === 'dinheiro' && orderDetails.changeFor) {
      msg += `*Troco para:* R$ ${orderDetails.changeFor.toFixed(2)}\n`;
    }
    if (orderDetails.customMessage) msg += `\n*Recado:* ${orderDetails.customMessage}\n`;
    msg += `\n*TOTAL:* R$ ${total.toFixed(2)}\n`;
    msg += `\n*Aguarde confirmação do seu pedido*`;

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');

    setIsOrdered(true);
  };

  if (session) {
    return (
      <AdminPanel
        products={products}
        neighborhoods={neighborhoods}
        categories={categories}
        whatsappNumber={whatsappNumber}
        isStoreOpen={isStoreOpen}
        closedMessage={closedMessage}
        onLogout={() => signOut()}
        onRefresh={loadData}
      />
    );
  }

  // Tela de Loja Fechada
  if (!isStoreOpen) {
    return (
      <div className="max-w-xl mx-auto min-h-screen bg-[#FDF4F4] shadow-2xl flex flex-col items-center justify-center p-8 text-center space-y-8 relative overflow-hidden">
        {/* Adorno de fundo */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[#D4A3A3]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-[#5D4037]/10 rounded-full blur-3xl" />

        <div className="bg-white p-8 rounded-[3rem] shadow-xl border-2 border-white/50 relative z-10 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-[#FDF4F4] text-[#D4A3A3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <UtensilsCrossed size={48} />
          </div>
          <h1 className="text-3xl font-black text-[#5D4037] mb-4">Doceria</h1>
          <div className="bg-red-50 text-red-500 px-4 py-1.5 rounded-full inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-8 border border-red-100">
            <Clock size={12} /> Fechado no momento
          </div>
          <p className="text-[#8C6B6B] font-medium leading-relaxed italic text-lg max-w-xs mx-auto">
            "{closedMessage}"
          </p>
        </div>

        <div className="space-y-4 pt-12 relative z-10">
          <button
            onClick={() => setShowAdminLogin(true)}
            className="flex items-center gap-2 text-[10px] font-black text-[#D4A3A3] uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all mx-auto"
          >
            <Lock size={12} /> Acesso Restrito
          </button>

          <div className="text-center space-y-1 opacity-40">
            <p className="text-[9px] font-black text-[#5D4037] uppercase tracking-widest">© 2025 ERA LABS. Todos os direitos reservados.</p>
            <p className="text-[10px] font-bold text-[#D4A3A3]">Desenvolvido com ❤️ pela Era Labs.</p>
          </div>
        </div>

        {/* MODAL ADMIN LOGIN */}
        {showAdminLogin && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
            <div className="w-full max-sm bg-white rounded-[3rem] p-8 space-y-8 shadow-2xl animate-in zoom-in duration-300">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-[#FDF4F4] text-[#D4A3A3] rounded-full flex items-center justify-center mx-auto shadow-inner"><Key size={32} /></div>
                <h2 className="text-2xl font-black text-[#5D4037]">Área Restrita</h2>
                <p className="text-sm text-[#8C6B6B] font-medium italic">Faça login para acessar o painel</p>
              </div>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  autoFocus
                  className="w-full border-2 border-[#F2E4E4] p-5 rounded-[2rem] text-center text-lg font-bold focus:border-[#D4A3A3] outline-none transition-all shadow-inner"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Senha"
                  className="w-full border-2 border-[#F2E4E4] p-5 rounded-[2rem] text-center text-lg font-bold focus:border-[#D4A3A3] outline-none transition-all shadow-inner"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleTryLogin()}
                />
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setShowAdminLogin(false); setPasswordInput(''); setEmailInput(''); }}
                    className="py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest text-[#8C6B6B] bg-gray-100 active:scale-95 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleTryLogin}
                    className="py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest text-white bg-[#D4A3A3] shadow-lg active:scale-95 transition"
                  >
                    Entrar Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-[#FDF4F4] shadow-2xl flex flex-col font-sans relative">
      <header className="bg-[#D4A3A3] text-white p-6 sticky top-0 z-50 flex justify-between items-center rounded-b-[2.5rem] shadow-lg border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2.5 rounded-full shadow-inner">
            <UtensilsCrossed className="text-[#D4A3A3]" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none">Doceria</h1>
            <div className="flex items-center gap-1 text-[10px] opacity-80 uppercase tracking-widest font-black mt-1">
              <Clock size={10} /> Aberto
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdminLogin(true)}
            className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-90"
          >
            <Lock size={20} />
          </button>
          <div className="relative p-2.5 bg-white/10 rounded-2xl cursor-pointer hover:bg-white/20 transition-all active:scale-90" onClick={() => step === 1 && cart.length > 0 && setStep(2)}>
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#5D4037] text-white text-[10px] font-black rounded-full w-6 h-6 flex items-center justify-center border-2 border-[#D4A3A3]">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-36">
        {isOrdered ? (
          <div className="p-10 text-center space-y-6 animate-in zoom-in">
            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-2xl font-black text-[#5D4037]">Pedido Enviado!</h2>
            <p className="text-[#8C6B6B] font-medium">Confirme no WhatsApp para finalizar.</p>
            <button onClick={handleNewOrder} className="w-full py-4 bg-[#D4A3A3] text-white rounded-2xl font-black uppercase shadow-lg active:scale-95 transition">Fazer novo pedido</button>
          </div>
        ) : (
          <>
            <div className="flex justify-center items-center py-6 gap-3">
              {[1, 2, 3, 4].map(s => (
                <React.Fragment key={s}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${step === s ? 'bg-[#5D4037] text-white scale-110 shadow-lg' : step > s ? 'bg-[#D4A3A3] text-white' : 'bg-white text-[#D4A3A3] border-2 border-[#D4A3A3]'}`}>
                    {step > s ? <CheckCircle2 size={18} /> : s}
                  </div>
                  {s < 4 && <div className={`h-1 w-6 rounded-full ${step > s ? 'bg-[#D4A3A3]' : 'bg-[#EAD1D1]'}`} />}
                </React.Fragment>
              ))}
            </div>

            {step === 1 && (
              <div className="px-4 animate-in fade-in">
                <div className="flex gap-3 overflow-x-auto py-3 no-scrollbar sticky top-24 z-40 bg-[#FDF4F4]/95 backdrop-blur-md">
                  {categoryNames.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`whitespace-nowrap px-6 py-3 rounded-full text-xs font-black transition-all shadow-sm border-2 ${activeCategory === cat ? 'bg-[#5D4037] text-white border-[#5D4037]' : 'bg-white text-[#5D4037] border-[#F2E4E4]'}`}>
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="grid gap-4 mt-4">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="flex gap-4 p-4 bg-white rounded-[2rem] border border-[#F2E4E4] shadow-sm active:scale-95 transition-all group overflow-hidden">
                      <img src={product.image} className="w-24 h-24 rounded-3xl object-cover bg-gray-50 flex-shrink-0" alt={product.name} />
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-black text-[#5D4037] text-base leading-tight">{product.name}</h3>
                          <p className="text-[11px] text-[#8C6B6B] line-clamp-2 mt-1 italic font-medium">{product.description}</p>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-[#D4A3A3] font-black text-base">R$ {product.price.toFixed(2)}</span>
                          <button
                            onClick={() => (product.options && product.options.length > 0) ? setSelectedProductForOptions(product) : handleAddToCart(product)}
                            className="bg-[#D4A3A3] text-white p-3 rounded-2xl shadow-lg active:scale-90 transition hover:bg-[#C28E8E]"
                          >
                            {(product.options && product.options.length > 0) ? <ChevronDown size={20} /> : <Plus size={20} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="p-6 space-y-6 animate-in slide-in-from-right-4">
                <h2 className="text-xl font-black text-[#5D4037] flex items-center gap-2 px-1"><ShoppingBag className="text-[#D4A3A3]" /> Carrinho</h2>
                <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-[#F2E4E4] space-y-6">
                  {cart.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex justify-between items-center pb-5 border-b border-[#F9F1F1] last:border-0 last:pb-0">
                      <div className="flex-1 pr-4">
                        <p className="font-black text-[#5D4037] text-sm leading-tight">{item.name}</p>
                        {item.selectedOption && <p className="text-[10px] text-[#D4A3A3] font-black uppercase tracking-widest mt-0.5">• {item.selectedOption.name}</p>}
                        <p className="text-xs text-[#8C6B6B] font-bold mt-1">R$ {item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-5 bg-[#FDF4F4] px-4 py-2.5 rounded-2xl border border-[#F2E4E4]">
                        <button onClick={() => updateQuantity(item.id, item.selectedOption?.name, -1)} className="text-[#D4A3A3] p-1"><Minus size={18} /></button>
                        <span className="font-black text-[#5D4037] text-sm w-5 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.selectedOption?.name, 1)} className="text-[#D4A3A3] p-1"><Plus size={18} /></button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between text-[#5D4037] font-black text-lg">
                    <span>Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#8C6B6B] uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                    <MessageSquare size={14} className="text-[#D4A3A3]" /> Algum recado?
                  </label>
                  <textarea
                    className="w-full border border-[#EAD1D1] rounded-[2rem] p-5 text-base focus:ring-4 focus:ring-[#D4A3A3]/20 outline-none bg-white min-h-[140px] shadow-inner"
                    placeholder="Ex: Coloque aqui um recadinho para quem você gosta."
                    value={orderDetails.customMessage}
                    onChange={e => setOrderDetails({ ...orderDetails, customMessage: e.target.value })}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="p-6 space-y-8 animate-in slide-in-from-right-4">
                <section className="space-y-4">
                  <h2 className="text-xl font-black text-[#5D4037] flex items-center gap-2 px-1"><User className="text-[#D4A3A3]" /> Seus Dados</h2>
                  <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-[#F2E4E4] space-y-5">
                    <input type="text" placeholder="Seu Nome *" className="w-full border border-[#EAD1D1] p-4 rounded-2xl text-base bg-white shadow-inner focus:ring-2 focus:ring-[#D4A3A3]/50 outline-none font-bold" value={orderDetails.customerName} onChange={e => setOrderDetails({ ...orderDetails, customerName: e.target.value })} />
                  </div>
                </section>
                <section className="space-y-4">
                  <h2 className="text-xl font-black text-[#5D4037] flex items-center gap-2 px-1"><MapPin className="text-[#D4A3A3]" /> Entrega</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setOrderDetails({ ...orderDetails, type: 'entrega' })} className={`py-4 rounded-[2rem] border-2 font-black text-[10px] uppercase tracking-widest transition-all ${orderDetails.type === 'entrega' ? 'border-[#D4A3A3] bg-[#F9EAEA] text-[#5D4037]' : 'border-white bg-white text-gray-300'}`}>🛵 Receber</button>
                    <button onClick={() => setOrderDetails({ ...orderDetails, type: 'retirada' })} className={`py-4 rounded-[2rem] border-2 font-black text-[10px] uppercase tracking-widest transition-all ${orderDetails.type === 'retirada' ? 'border-[#D4A3A3] bg-[#F9EAEA] text-[#5D4037]' : 'border-white bg-white text-gray-300'}`}>🏪 Retirar</button>
                  </div>
                  {orderDetails.type === 'entrega' && (
                    <div className="space-y-4 bg-white p-7 rounded-[2.5rem] shadow-sm border border-[#F2E4E4]">
                      <select className="w-full border border-[#EAD1D1] p-4 rounded-2xl bg-white text-base font-bold text-[#5D4037] appearance-none" value={orderDetails.neighborhoodId || ''} onChange={e => setOrderDetails({ ...orderDetails, neighborhoodId: e.target.value })}>
                        <option value="">Onde você está? *</option>
                        {neighborhoods.map(n => <option key={n.id} value={n.id}>{n.name} (+ R$ {n.fee.toFixed(2)})</option>)}
                      </select>
                      <div className="grid grid-cols-4 gap-3">
                        <input type="text" placeholder="Rua *" className="col-span-3 border border-[#EAD1D1] p-4 rounded-2xl text-base bg-white font-medium" value={orderDetails.street || ''} onChange={e => setOrderDetails({ ...orderDetails, street: e.target.value })} />
                        <input type="text" placeholder="Nº *" className="col-span-1 border border-[#EAD1D1] p-4 rounded-2xl text-base bg-white font-medium" value={orderDetails.number || ''} onChange={e => setOrderDetails({ ...orderDetails, number: e.target.value })} />
                      </div>
                      <input type="text" placeholder="Referência (Opcional)" className="w-full border border-[#EAD1D1] p-4 rounded-2xl text-base bg-white font-medium" value={orderDetails.reference || ''} onChange={e => setOrderDetails({ ...orderDetails, reference: e.target.value })} />
                    </div>
                  )}
                </section>
              </div>
            )}

            {step === 4 && (
              <div className="p-6 space-y-8 animate-in slide-in-from-right-4 pb-12">
                <section className="space-y-4">
                  <h2 className="text-xl font-black text-[#5D4037] px-1">Resumo Final</h2>
                  <div className="bg-white p-7 rounded-[3rem] shadow-sm border border-[#F2E4E4] space-y-6">
                    <div className="space-y-4">
                      <div className="pb-3 border-b-2 border-[#F9F1F1]">
                        <p className="text-[10px] font-black text-[#8C6B6B] uppercase tracking-widest">Cliente</p>
                        <p className="font-black text-[#5D4037] text-lg">{orderDetails.customerName}</p>
                      </div>
                      {cart.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex justify-between text-base">
                          <span className="text-[#5D4037] font-bold">{item.quantity}x {item.name} {item.selectedOption && `(${item.selectedOption.name})`}</span>
                          <span className="font-black">R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t-2 border-[#F9F1F1] pt-6 space-y-2 font-black">
                      <div className="flex justify-between text-xs text-[#8C6B6B] uppercase tracking-widest"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
                      {orderDetails.type === 'entrega' && (
                        <div className="flex justify-between text-xs text-[#8C6B6B] uppercase tracking-widest">
                          <span>Taxa de Entrega</span>
                          <span>R$ {deliveryFee.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-3xl text-[#D4A3A3] pt-6 border-t-2 border-[#F2E4E4] mt-4"><span>TOTAL</span><span>R$ {total.toFixed(2)}</span></div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-black text-[#5D4037] flex items-center gap-2 px-1"><CreditCard className="text-[#D4A3A3]" /> Pagamento</h2>
                  <div className="space-y-3">
                    {(['pix', 'dinheiro', 'cartao'] as PaymentMethod[]).map(m => (
                      <div key={m} className="space-y-2">
                        <button onClick={() => setOrderDetails({ ...orderDetails, paymentMethod: m })} className={`w-full p-4 rounded-2xl border-2 font-black text-sm flex items-center justify-between transition-all ${orderDetails.paymentMethod === m ? 'border-[#D4A3A3] bg-[#F9EAEA] text-[#5D4037]' : 'border-white bg-white text-gray-300'}`}>
                          <span className="capitalize">{m === 'cartao' ? 'Cartão' : m}</span>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${orderDetails.paymentMethod === m ? 'border-[#D4A3A3]' : 'border-gray-200'}`}>{orderDetails.paymentMethod === m && <div className="w-3 h-3 rounded-full bg-[#D4A3A3]" />}</div>
                        </button>
                        {m === 'dinheiro' && orderDetails.paymentMethod === 'dinheiro' && (
                          <div className="bg-white p-4 rounded-2xl border border-[#F2E4E4] space-y-3 animate-in slide-in-from-top-2">
                            <label className="text-[10px] font-black text-[#8C6B6B] uppercase tracking-widest flex items-center gap-2">
                              <Banknote size={14} className="text-[#D4A3A3]" /> Precisa de troco?
                            </label>
                            <input
                              type="number"
                              placeholder="Troco para quanto?"
                              className="w-full border border-[#EAD1D1] p-3 rounded-xl text-sm bg-white outline-none focus:border-[#D4A3A3]"
                              value={orderDetails.changeFor || ''}
                              onChange={e => setOrderDetails({ ...orderDetails, changeFor: parseFloat(e.target.value) })}
                            />
                            <p className="text-[9px] text-gray-400 italic">Deixe em branco se não precisar de troco.</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            <div className="py-12 text-center space-y-2 opacity-40 hover:opacity-100 transition-opacity">
              <p className="text-[10px] font-black text-[#5D4037] uppercase tracking-widest">© 2025 ERA LABS. Todos os direitos reservados.</p>
              <p className="text-[11px] font-bold text-[#D4A3A3]">Desenvolvido com ❤️ pela Era Labs.</p>
            </div>
          </>
        )}
      </main>

      {selectedProductForOptions && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setSelectedProductForOptions(null)}>
          <div className="w-full max-w-xl bg-white rounded-t-[3rem] p-8 space-y-6 animate-in slide-in-from-bottom-full duration-500">
            <div className="flex justify-between items-start">
              <div><h3 className="text-2xl font-black text-[#5D4037]">{selectedProductForOptions.name}</h3><p className="text-sm text-[#8C6B6B]">Escolha uma opção:</p></div>
              <button onClick={() => setSelectedProductForOptions(null)} className="p-2 bg-[#FDF4F4] rounded-full text-[#D4A3A3]"><X size={24} /></button>
            </div>
            <div className="space-y-3 max-h-[50vh] overflow-y-auto no-scrollbar py-2">
              {selectedProductForOptions.options?.map((opt, i) => (
                <button key={i} onClick={() => handleAddToCart(selectedProductForOptions, opt)} className="w-full p-5 bg-[#FDF4F4] rounded-[1.5rem] border-2 border-[#F2E4E4] hover:border-[#D4A3A3] transition-all flex justify-between items-center group active:scale-95">
                  <span className="font-black text-[#5D4037] group-hover:text-[#D4A3A3]">{opt.name}</span>
                  <div className="flex items-center gap-3"><span className="font-black text-[#D4A3A3]">R$ {(opt.price ?? selectedProductForOptions.price).toFixed(2)}</span><Plus size={20} className="text-[#D4A3A3]" /></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
          <div className="w-full max-sm bg-white rounded-[3rem] p-8 space-y-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-[#FDF4F4] text-[#D4A3A3] rounded-full flex items-center justify-center mx-auto shadow-inner"><Key size={32} /></div>
              <h2 className="text-2xl font-black text-[#5D4037]">Área Restrita</h2>
              <p className="text-sm text-[#8C6B6B] font-medium italic">Faça login para acessar o painel</p>
            </div>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                autoFocus
                className="w-full border-2 border-[#F2E4E4] p-5 rounded-[2rem] text-center text-lg font-bold focus:border-[#D4A3A3] outline-none transition-all shadow-inner"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
              />
              <input
                type="password"
                placeholder="Senha"
                className="w-full border-2 border-[#F2E4E4] p-5 rounded-[2rem] text-center text-lg font-bold focus:border-[#D4A3A3] outline-none transition-all shadow-inner"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTryLogin()}
              />
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setShowAdminLogin(false); setPasswordInput(''); setEmailInput(''); }}
                  className="py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest text-[#8C6B6B] bg-gray-100 active:scale-95 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleTryLogin}
                  className="py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest text-white bg-[#D4A3A3] shadow-lg active:scale-95 transition"
                >
                  Entrar Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isOrdered && (
        <footer className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto p-4 bg-white/95 backdrop-blur-2xl border-t border-[#F2E4E4] z-40 rounded-t-[3.5rem] shadow-xl">
          <div className="flex gap-4">
            {step > 1 && <button onClick={() => setStep(s => s - 1)} className="p-3.5 bg-[#FDF4F4] text-[#5D4037] rounded-3xl border border-[#EAD1D1]"><ChevronLeft size={24} /></button>}
            <button
              disabled={step === 1 && cart.length === 0 || step === 3 && (!orderDetails.customerName || (orderDetails.type === 'entrega' && !orderDetails.neighborhoodId))}
              onClick={() => step < 4 ? setStep(s => s + 1) : handleFinalize()}
              className={`flex-1 font-black py-4 rounded-3xl shadow-lg flex items-center justify-center gap-3 uppercase tracking-widest text-xs transition-all active:scale-95 disabled:opacity-30 ${step === 4 ? 'bg-[#5D4037] text-white' : 'bg-[#D4A3A3] text-white'}`}
            >
              {step === 4 ? <><Send size={20} /> Enviar Pedido</> : <>Avançar <ChevronRight size={20} /></>}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
