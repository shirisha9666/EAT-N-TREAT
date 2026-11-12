import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCart } from './context/CartContext.jsx'
import {
  ArrowRight,
  BadgeCheck,
  CakeSlice,
  Camera,
  Check,
  ChevronRight,
  Clock3,
  Gift,
  Heart,
  Info,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  X,
} from 'lucide-react'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Our Menu', to: '/menu' },
  { label: 'Customize Cake', to: '/customize' },
  { label: 'Offers', to: '/offers' },
  { label: 'Contact', to: '/contact' },
]

const categoryCards = [
  {
    title: 'Birthday Cakes',
    accent: 'Celebrate with a showstopper',
    image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Chocolate Cakes',
    accent: 'Rich ganache dream',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Black Forest Cakes',
    accent: 'Velvety chocolate & cherry',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Red Velvet Cakes',
    accent: 'Soft crimson indulgence',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Butterscotch Cakes',
    accent: 'Golden caramel comfort',
    image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=900&q=80',
  },
]

const productCatalog = [
  {
    id: 'strawberry-fountain',
    name: 'Strawberry Fountain Cake',
    price: 1999,
    tag: 'Signature',
    image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=900&q=80',
    description: 'Buttery sponge, vanilla cream, fresh strawberry compote.',
    ingredients: ['Milk sponge', 'Fresh strawberries', 'Whipped cream', 'Berry glaze'],
    prep: 'Slow-baked vanilla sponge layered with cream and fruit compote.',
  },
  {
    id: 'dark-choco-velvet',
    name: 'Dark Choco Velvet',
    price: 2199,
    tag: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=900&q=80',
    description: 'Silky ganache layers with cocoa crumb and rose notes.',
    ingredients: ['Dark chocolate', 'Cocoa crumb', 'Velvet sponge', 'Ganache'],
    prep: 'Rich chocolate sponge finished with fluid ganache and delicate cocoa dust.',
  },
  {
    id: 'black-forest-bliss',
    name: 'Black Forest Bliss',
    price: 1899,
    tag: 'Classic',
    image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=900&q=80',
    description: 'Chocolate sponge, whipped cream, cherry finish.',
    ingredients: ['Chocolate sponge', 'Cherry compote', 'Cream', 'Cocoa'],
    prep: 'Layered with cherry filling and finished with soft cream rosettes.',
  },
  {
    id: 'caramel-burst',
    name: 'Caramel Burst',
    price: 1749,
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=80',
    description: 'Butterscotch layers with crunchy praline crunch.',
    ingredients: ['Butterscotch', 'Praline crunch', 'Vanilla cream', 'Caramel top'],
    prep: 'Golden caramel notes layered into a soft butterscotch sponge.',
  },
  {
    id: 'rose-petal-fusion',
    name: 'Rose Petal Fusion',
    price: 2299,
    tag: 'Premium',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80',
    description: 'A floral vanilla dream with berry undertones.',
    ingredients: ['Rose cream', 'Vanilla sponge', 'Berries', 'Petal glaze'],
    prep: 'Crafted for elegant gifting and floral celebration themes.',
  },
  {
    id: 'mango-cream-luxe',
    name: 'Mango Cream Luxe',
    price: 2099,
    tag: 'Seasonal',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80',
    description: 'Fresh mango cream layers for bright, tropical joy.',
    ingredients: ['Mango pulp', 'Cream', 'Sponge', 'Coconut dust'],
    prep: 'Fresh-cut seasonal fruit blended into a silky tropical cream finish.',
  },
]

const paymentMethods = ['UPI', 'Debit/Credit Card', 'Cash on Delivery', 'WhatsApp Pay Demo']

const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

gsap.registerPlugin(ScrollTrigger)

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = () => setHasError(true)
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream p-6 text-center text-cocoa">
        <div className="max-w-md rounded-[2rem] bg-white p-8 shadow-luxe">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-berry">
            <Info className="h-7 w-7" />
          </div>
          <h1 className="font-display text-4xl text-burgundy">Something went wrong.</h1>
          <p className="mt-4 text-cocoa/75">The bakery page is temporarily unavailable. Please refresh to continue.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-berry px-5 py-3 font-semibold text-white"
          >
            Refresh page
          </button>
        </div>
      </div>
    )
  }

  return children
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}

function App() {
  const { cartCount } = useCart()

  return (
    <div className="min-h-screen bg-cream text-cocoa">
      <Header cartCount={cartCount} />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/customize" element={<CustomizePage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/order-tracking" element={<OrderTrackingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      <CartDrawer />
    </div>
  )
}

function Header({ cartCount }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { setIsCartOpen } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-burgundy text-white shadow-xl shadow-burgundy/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-caramel shadow-lg shadow-caramel/20">
            <CakeSlice className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-xl font-bold tracking-tight sm:text-2xl">EAT N TREAT</div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-pink-100">Every Bite is a Little Celebration!</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-caramel ${isActive ? 'text-caramel' : 'text-white/90'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button type="button" className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10 sm:flex" aria-label="Search products">
            <Search className="h-4 w-4" />
          </button>
          <button type="button" className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10 sm:flex" aria-label="Wishlist">
            <Heart className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-berry to-pink-500 text-white shadow-lg shadow-pink-500/30 transition hover:scale-[1.03]"
            aria-label="Open shopping cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-caramel px-1 text-[10px] font-bold text-burgundy">
                {cartCount}
              </span>
            )}
          </button>

          <Link to="/customize" className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-burgundy transition hover:bg-cream md:inline-flex">
            Order Now
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 lg:hidden"
            aria-label="Open menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-white/10 bg-burgundy/95 lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-3 text-base font-medium transition ${isActive ? 'bg-white/10 text-caramel' : 'text-white/90 hover:bg-white/5'}`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function HomePage() {
  const { addToCart } = useCart()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-reveal', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' })
      gsap.utils.toArray('.animate-section').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 80%' },
          },
        )
      })
    })

    return () => ctx.revert()
  }, [])

  const handleAddCustomCake = () => {
    addToCart({
      id: 'custom-hero-cake',
      name: 'Custom Belgian Dark Chocolate Cake',
      price: 1899,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=900&q=80',
      description: '0.75 kg • Strawberry Cream • Fresh Strawberries',
    })
  }

  return (
    <main>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,182,200,0.55),_rgba(100,21,45,0.95)_38%,_rgba(59,23,37,1)_100%)] text-white">
        <div className="absolute inset-0 opacity-70">
          <div className="absolute left-1/2 top-12 h-64 w-64 -translate-x-1/2 rounded-full bg-berry/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-strawberry/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-28 lg:pt-14">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-7">
              <div className="hero-reveal inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium tracking-[0.28em] text-pink-100 uppercase">
                <Sparkles className="h-3.5 w-3.5 text-caramel" />
                Premium dessert boutique
              </div>

              <div className="space-y-4">
                <h1 className="hero-reveal max-w-xl font-display text-5xl leading-none text-white sm:text-6xl lg:text-[5rem]">
                  Every Bite is a Little Celebration!
                </h1>
                <p className="hero-reveal max-w-lg text-lg text-pink-100 sm:text-xl">Freshly Baked Happiness, Crafted with Love.</p>
                <p className="hero-reveal max-w-xl text-base text-white/80 sm:text-lg">
                  Discover delicious cakes, irresistible desserts and freshly baked treats made for your special moments.
                </p>
              </div>

              <div className="hero-reveal flex flex-wrap items-center gap-4">
                <Link to="/menu" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-berry to-pink-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:-translate-y-0.5">
                  Explore Our Cakes <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/customize" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10">
                  Order Now
                </Link>
              </div>

              <div className="hero-reveal grid max-w-xl grid-cols-3 gap-4 pt-2">
                {[
                  { label: 'signature recipes', value: '25+' },
                  { label: 'customer delight', value: '4.9/5' },
                  { label: 'fresh-bake promise', value: '12 hrs' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur-sm">
                    <div className="font-display text-2xl font-bold text-caramel">{item.value}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/70">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-center py-5">
              <div className="cake-scene relative w-full max-w-[560px]">
                <div className="absolute right-3 top-8 rounded-full border border-caramel/60 bg-white/10 px-3 py-2 text-xs font-medium text-pink-100 backdrop-blur-md">
                  Freshly baked today
                </div>
                <div className="absolute left-3 top-1/3 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-pink-50 backdrop-blur-md">
                  <span className="text-caramel">4.9</span> rated desserts
                </div>

                <div className="relative mx-auto flex h-[430px] w-full max-w-[520px] items-center justify-center">
                  <CakeScene />
                </div>

                <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-berry" />
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-caramel" />
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-strawberry" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="animate-section relative overflow-hidden bg-cream py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-burgundy/10 bg-white p-3 shadow-luxe">
              <img src="https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=1000&q=80" alt="Fresh bakery cakes" className="h-[540px] w-full rounded-[1.5rem] object-cover" />
            </div>
            <div className="absolute -bottom-8 left-5 rounded-2xl bg-white/90 p-4 shadow-xl shadow-burgundy/10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-berry">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-burgundy">1,200+</div>
                  <p className="text-xs uppercase tracking-[0.2em] text-burgundy/70">custom orders</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-4 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-berry">
              <Sparkles className="h-4 w-4" /> Baked fresh, served with love
            </p>
            <h2 className="font-display text-4xl leading-tight text-burgundy sm:text-5xl">Crafted for moments worth celebrating.</h2>
            <p className="mt-6 text-lg text-cocoa/75">
              At EAT N TREAT, we turn everyday sweet cravings into unforgettable celebrations with handcrafted cakes, soft center pastries, and bakery favourites made to feel luxurious.
            </p>

            <div className="mt-8 space-y-4">
              {[
                'Freshly prepared cakes with premium ingredients',
                'Custom celebration cakes tailored to every theme',
                'Clean, hygienic preparation and gifting-friendly packaging',
                'Celebration specialists for birthdays, weddings and gifting',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-burgundy/5">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-berry">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <p className="text-base text-cocoa/80">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="animate-section bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-berry">Favorites</p>
              <h2 className="font-display text-4xl text-burgundy sm:text-5xl">Explore Our Delicious World!</h2>
            </div>
            <Link to="/menu" className="inline-flex items-center gap-2 rounded-full border border-burgundy/15 bg-cream px-4 py-2.5 text-sm font-semibold text-burgundy transition hover:bg-pink-50">
              View all treats <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {categoryCards.map((card) => (
              <motion.article key={card.title} whileHover={{ y: -8 }} className="group overflow-hidden rounded-[1.75rem] border border-burgundy/10 bg-white shadow-md shadow-burgundy/5">
                <div className="relative h-72 overflow-hidden">
                  <img src={card.image} alt={card.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy/70 via-burgundy/10 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 text-white">
                    <div className="text-xs uppercase tracking-[0.2em] text-pink-100">{card.accent}</div>
                    <h3 className="mt-2 font-display text-2xl font-bold">{card.title}</h3>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="animate-section bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-berry">Top picks</p>
              <h2 className="font-display text-4xl text-burgundy sm:text-5xl">Most Loved Desserts</h2>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {productCatalog.map((product) => (
              <motion.article key={product.id} whileHover={{ y: -8 }} className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-burgundy/10 bg-white shadow-lg shadow-burgundy/5">
                <div className="relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="h-72 w-full object-cover transition duration-500 group-hover:scale-110" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-burgundy">{product.tag}</span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-2xl text-burgundy">{product.name}</h3>
                    <div className="flex items-center gap-1 rounded-full bg-caramel/20 px-2 py-1 text-xs font-semibold text-burgundy">
                      <Star className="h-3.5 w-3.5 fill-current" /> 4.9
                    </div>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-6 text-cocoa/70">{product.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="font-display text-3xl text-burgundy">{formatPrice(product.price)}</div>
                    <div className="flex gap-2">
                      <Link to={`/product/${product.id}`} className="rounded-full border border-burgundy/10 bg-cream px-3 py-2 text-sm font-semibold text-burgundy transition hover:bg-pink-50">Details</Link>
                      <button type="button" onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, description: product.description })} className="inline-flex items-center gap-2 rounded-full bg-berry px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-500">
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="animate-section bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#64152D_0%,#8b2144_40%,#E91E63_100%)] p-6 text-white shadow-luxe sm:p-8 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-pink-100">
                  <Gift className="h-3.5 w-3.5 text-caramel" /> Special offer
                </p>
                <h2 className="font-display text-4xl text-white sm:text-5xl">Sweet celebrations, curated for your moments.</h2>
                <p className="mt-4 max-w-xl text-base text-pink-100">
                  Get complimentary mini dessert jars with every celebration cake over ₹3,000. Perfect for birthdays, family dinners and gifting moments.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link to="/customize" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-burgundy transition hover:bg-cream">
                    Customize your cake <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                    WhatsApp us <MessageCircle className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="relative flex justify-center">
                <div className="rounded-[2rem] bg-white/10 p-5 backdrop-blur-sm">
                  <div className="rounded-[1.5rem] bg-white p-5 text-burgundy shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.2em] text-burgundy/60">Celebration Box</span>
                      <span className="rounded-full bg-pink-100 px-2 py-1 text-[10px] font-semibold text-berry">Save 15%</span>
                    </div>
                    <div className="mt-4 font-display text-4xl">₹3,499</div>
                    <div className="mt-4 space-y-3 text-sm text-cocoa/75">
                      <div className="flex items-center justify-between border-b border-burgundy/10 pb-2"><span>Custom cake</span><span>Included</span></div>
                      <div className="flex items-center justify-between border-b border-burgundy/10 pb-2"><span>Mini desserts</span><span>2 pieces</span></div>
                      <div className="flex items-center justify-between"><span>Delivery</span><span>Free in city</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="animate-section bg-cream py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="rounded-[2rem] bg-white p-6 shadow-luxe ring-1 ring-burgundy/5 sm:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-berry">Custom creations</p>
            <h2 className="font-display text-4xl text-burgundy">Design your dream cake</h2>
            <p className="mt-4 text-base text-cocoa/75">Select a size, flavour and finish that matches your celebration style.</p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-cocoa">Cake weight</label>
                <div className="grid grid-cols-2 gap-3">
                  {['0.5 kg', '0.75 kg', '1 kg', '1.5 kg'].map((weight) => (
                    <button key={weight} type="button" className="rounded-full border border-burgundy/10 bg-cream px-3 py-2.5 text-sm font-medium text-cocoa/75 transition hover:border-berry/60">{weight}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-cocoa">Flavour</label>
                <select defaultValue="Belgian Dark Chocolate" className="w-full rounded-2xl border border-burgundy/10 bg-cream px-4 py-3 text-base text-cocoa outline-none transition focus:border-berry">
                  <option>Belgian Dark Chocolate</option>
                  <option>Vanilla Bean</option>
                  <option>Strawberry Cream</option>
                  <option>Butterscotch Delight</option>
                  <option>Red Velvet</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-cocoa">Frosting</label>
                <select defaultValue="Strawberry Cream" className="w-full rounded-2xl border border-burgundy/10 bg-cream px-4 py-3 text-base text-cocoa outline-none transition focus:border-berry">
                  <option>Strawberry Cream</option>
                  <option>Vanilla Bean</option>
                  <option>Chocolate Ganache</option>
                  <option>Caramel Swiss Meringue</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[linear-gradient(135deg,#FFF0E8_0%,#ffeaf2_100%)] p-6 shadow-luxe ring-1 ring-burgundy/5 sm:p-8">
            <div className="overflow-hidden rounded-[1.75rem] border border-burgundy/10 bg-white p-5 shadow-md">
              <img src="https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=900&q=80" alt="Custom cake preview" className="h-64 w-full rounded-[1.25rem] object-cover" />
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-berry">Custom design</div>
                    <div className="mt-1 font-display text-3xl text-burgundy">Belgian Dark Chocolate</div>
                  </div>
                  <div className="font-display text-3xl text-burgundy">₹1,899</div>
                </div>
                <div className="rounded-2xl bg-cream p-3 text-sm text-cocoa/75">
                  <div className="flex items-center justify-between py-2"><span>Weight</span><span>0.75 kg</span></div>
                  <div className="flex items-center justify-between py-2"><span>Frosting</span><span>Strawberry Cream</span></div>
                  <div className="flex items-center justify-between py-2"><span>Decor</span><span>Fresh Strawberries</span></div>
                </div>
                <button type="button" onClick={handleAddCustomCake} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-berry to-pink-500 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-pink-500/25 transition hover:-translate-y-0.5">
                  Add custom cake <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-berry">Loved by families</p>
            <h2 className="font-display text-4xl text-burgundy sm:text-5xl">Sweet stories from our guests</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              'The cake looked like a boutique couture creation and tasted even better. We loved every bite!',
              'Perfect for our anniversary. The customization process was easy and the finish was stunning.',
              'From order to delivery, the experience felt premium and warm. Highly recommended for celebrations.',
            ].map((quote, index) => (
              <div key={quote} className="rounded-[1.75rem] border border-burgundy/10 bg-cream p-6 shadow-md">
                <div className="mb-4 flex items-center gap-1 text-caramel">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={`${quote}-${starIndex}`} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-base leading-7 text-cocoa/75">“{quote}”</p>
                <div className="mt-6 font-display text-2xl text-burgundy">{['Aisha R.', 'Nikhil M.', 'Sana K.'][index]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="animate-section bg-[linear-gradient(180deg,#FFF0E8_0%,#f7e1ea_100%)] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] bg-burgundy p-7 text-white shadow-luxe sm:p-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-pink-100">Visit us</p>
              <h2 className="font-display text-4xl text-white sm:text-5xl">Let’s make your next celebration extra sweet.</h2>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-4">
                  <MapPin className="mt-1 h-5 w-5 text-caramel" />
                  <div>
                    <div className="font-medium text-white">EAT N TREAT Bakery Studio</div>
                    <p className="text-sm text-pink-100">Banjara Hills, Hyderabad, Telangana</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-4">
                  <Phone className="mt-1 h-5 w-5 text-caramel" />
                  <div>
                    <div className="font-medium text-white">+91 98765 43210</div>
                    <p className="text-sm text-pink-100">Call for custom cake consultations</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-4">
                  <Clock3 className="mt-1 h-5 w-5 text-caramel" />
                  <div>
                    <div className="font-medium text-white">Open daily</div>
                    <p className="text-sm text-pink-100">9:00 AM – 10:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-berry to-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110">
                  Chat on WhatsApp <MessageCircle className="h-4 w-4" />
                </a>
                <a href="tel:+919876543210" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Call bakery <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-burgundy/10 bg-white p-4 shadow-luxe">
              <div className="rounded-[1.5rem] bg-[radial-gradient(circle_at_top,_rgba(255,182,200,0.7),_rgba(255,255,255,1)_45%)] p-4">
                <div className="rounded-[1.25rem] border border-burgundy/10 bg-white/80 p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between text-burgundy">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                        <MapPin className="h-5 w-5 text-berry" />
                      </div>
                      <div>
                        <div className="font-semibold">Hyderabad</div>
                        <div className="text-xs uppercase tracking-[0.2em] text-burgundy/60">Bakery pickup point</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-caramel/20 px-2 py-1 text-xs font-semibold text-burgundy">
                      <Truck className="h-3.5 w-3.5" /> City delivery
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[1.25rem] border border-burgundy/10 bg-cream p-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                        <div className="font-display text-2xl text-burgundy">24 min</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-burgundy/60">Avg. wait</div>
                      </div>
                      <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                        <div className="font-display text-2xl text-burgundy">12k</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-burgundy/60">Happy bites</div>
                      </div>
                      <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
                        <div className="font-display text-2xl text-burgundy">100%</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-burgundy/60">Freshness</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function AboutPage() {
  const stats = [
    { label: 'Hands-crafted cakes', value: '1200+' },
    { label: 'Stringent hygiene checks', value: '7-step' },
    { label: 'Custom celebration design', value: '100%' },
  ]

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-berry">About us</p>
        <h1 className="font-display text-5xl text-burgundy">Baked with care, designed for joy.</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem] shadow-luxe">
          <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80" alt="Bakery kitchen" className="h-full w-full object-cover" />
        </div>
        <div className="space-y-6 rounded-[2rem] bg-white p-8 shadow-luxe ring-1 ring-burgundy/5">
          <p className="text-lg leading-8 text-cocoa/75">
            EAT N TREAT is a premium dessert boutique built around one promise: every celebration deserves a cake that feels personal, luxurious and memorable.
          </p>
          <p className="text-lg leading-8 text-cocoa/75">
            From buttery celebration layers to rich chocolate masterpieces, we combine quality ingredients, careful craftsmanship and celebration-first design thinking for every order.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl bg-cream p-4 text-center">
                <div className="font-display text-3xl text-burgundy">{item.value}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.14em] text-cocoa/65">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

function MenuPage() {
  const { addToCart } = useCart()

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-berry">Our menu</p>
          <h1 className="font-display text-5xl text-burgundy">A world of sweet indulgence</h1>
        </div>
        <Link to="/customize" className="inline-flex items-center gap-2 rounded-full bg-berry px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-500">
          Build your custom cake <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {productCatalog.map((product) => (
          <motion.article key={product.id} whileHover={{ y: -8 }} className="overflow-hidden rounded-[1.75rem] border border-burgundy/10 bg-white shadow-lg shadow-burgundy/5">
            <img src={product.image} alt={product.name} className="h-72 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl text-burgundy">{product.name}</h2>
                <span className="rounded-full bg-pink-100 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-berry">{product.tag}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-cocoa/70">{product.description}</p>
              <div className="mt-5 flex items-center justify-between">
                <div className="font-display text-3xl text-burgundy">{formatPrice(product.price)}</div>
                <div className="flex gap-2">
                  <Link to={`/product/${product.id}`} className="rounded-full border border-burgundy/10 bg-cream px-3 py-2 text-sm font-semibold text-burgundy">Details</Link>
                  <button type="button" onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, description: product.description })} className="rounded-full bg-berry px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-500">
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </main>
  )
}

function ProductDetailPage() {
  const { id } = useParams()
  const product = productCatalog.find((item) => item.id === id)
  const { addToCart } = useCart()

  if (!product) {
    return <Navigate to="/menu" replace />
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[2rem] shadow-luxe">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="rounded-[2rem] bg-white p-7 shadow-luxe ring-1 ring-burgundy/5">
          <div className="inline-flex rounded-full bg-pink-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-berry">{product.tag}</div>
          <h1 className="mt-4 font-display text-5xl text-burgundy">{product.name}</h1>
          <div className="mt-4 flex items-center gap-2 text-caramel">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={`${product.id}-${index}`} className="h-4 w-4 fill-current" />
            ))}
            <span className="text-sm font-medium text-cocoa/70">Rated 4.9</span>
          </div>

          <div className="mt-6 font-display text-5xl text-burgundy">{formatPrice(product.price)}</div>
          <p className="mt-6 text-base leading-8 text-cocoa/75">{product.description}</p>

          <div className="mt-8 space-y-4">
            <div>
              <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-berry">Ingredients</div>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient) => (
                  <span key={ingredient} className="rounded-full border border-burgundy/10 bg-cream px-3 py-1.5 text-sm text-cocoa/75">{ingredient}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-berry">Preparation</div>
              <p className="text-base leading-7 text-cocoa/75">{product.prep}</p>
            </div>
          </div>

          <button type="button" onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, description: product.description })} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-berry to-pink-500 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-pink-500/25">
            Add to cart <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  )
}

function CustomizePage() {
  const { addToCart } = useCart()
  const [customCake, setCustomCake] = useState({
    weight: '1 kg',
    flavour: 'Strawberry Cream',
    frosting: 'Vanilla Bean',
    decorations: 'Gold Dust',
  })

  const customCakePrice = 2199

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-berry">Customize</p>
        <h1 className="font-display text-5xl text-burgundy">Create your perfect celebration cake</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-luxe ring-1 ring-burgundy/5 sm:p-8">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-cocoa">Cake weight</label>
              <div className="grid grid-cols-2 gap-3">
                {['0.5 kg', '0.75 kg', '1 kg', '1.5 kg'].map((value) => (
                  <button key={value} type="button" onClick={() => setCustomCake((current) => ({ ...current, weight: value }))} className={`rounded-full border px-3 py-2.5 text-sm font-medium transition ${customCake.weight === value ? 'border-berry bg-pink-50 text-berry' : 'border-burgundy/10 bg-cream text-cocoa/75'}`}>
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-cocoa">Flavour</label>
              <select value={customCake.flavour} onChange={(event) => setCustomCake((current) => ({ ...current, flavour: event.target.value }))} className="w-full rounded-2xl border border-burgundy/10 bg-cream px-4 py-3 text-base text-cocoa outline-none transition focus:border-berry">
                <option>Belgian Dark Chocolate</option>
                <option>Vanilla Bean</option>
                <option>Strawberry Cream</option>
                <option>Butterscotch Delight</option>
                <option>Red Velvet</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-cocoa">Frosting</label>
              <select value={customCake.frosting} onChange={(event) => setCustomCake((current) => ({ ...current, frosting: event.target.value }))} className="w-full rounded-2xl border border-burgundy/10 bg-cream px-4 py-3 text-base text-cocoa outline-none transition focus:border-berry">
                <option>Vanilla Bean</option>
                <option>Chocolate Ganache</option>
                <option>Strawberry Cream</option>
                <option>Caramel Swiss Meringue</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-cocoa">Decorations</label>
              <select value={customCake.decorations} onChange={(event) => setCustomCake((current) => ({ ...current, decorations: event.target.value }))} className="w-full rounded-2xl border border-burgundy/10 bg-cream px-4 py-3 text-base text-cocoa outline-none transition focus:border-berry">
                <option>Gold Dust</option>
                <option>Fresh Strawberries</option>
                <option>Buttercream Roses</option>
                <option>Choco Drizzle</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#FFF0E8_0%,#ffeaf2_100%)] p-6 shadow-luxe ring-1 ring-burgundy/5 sm:p-8">
          <div className="overflow-hidden rounded-[1.75rem] border border-burgundy/10 bg-white p-5">
            <img src="https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=900&q=80" alt="Custom cake preview" className="h-72 w-full rounded-[1.25rem] object-cover" />
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-berry">Custom design</div>
                  <div className="mt-1 font-display text-3xl text-burgundy">{customCake.flavour}</div>
                </div>
                <div className="font-display text-3xl text-burgundy">{formatPrice(customCakePrice)}</div>
              </div>

              <div className="rounded-2xl bg-cream p-3 text-sm text-cocoa/75">
                <div className="flex items-center justify-between py-2"><span>Weight</span><span>{customCake.weight}</span></div>
                <div className="flex items-center justify-between py-2"><span>Frosting</span><span>{customCake.frosting}</span></div>
                <div className="flex items-center justify-between py-2"><span>Decor</span><span>{customCake.decorations}</span></div>
              </div>

              <button type="button" onClick={() => addToCart({ id: `custom-${Date.now()}`, name: `Custom ${customCake.flavour} Cake`, price: customCakePrice, quantity: 1, image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=900&q=80', description: `${customCake.weight} • ${customCake.frosting} • ${customCake.decorations}` })} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-berry to-pink-500 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-pink-500/25 transition hover:-translate-y-0.5">
                Add to cart <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function OffersPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-berry">Offers</p>
        <h1 className="font-display text-5xl text-burgundy">Sweet deals for every celebration.</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { title: 'Birthday Delight', offer: 'Free mini dessert jar', detail: 'On every celebration cake above ₹2,500.' },
          { title: 'Midweek Treat', offer: '15% off selected cakes', detail: 'Valid on Tuesday and Wednesday orders.' },
          { title: 'Bulk Celebration', offer: 'Complimentary delivery', detail: 'For group orders above 25 pieces and custom cakes.' },
        ].map((offer) => (
          <div key={offer.title} className="rounded-[2rem] bg-gradient-to-br from-burgundy to-rose-700 p-6 text-white shadow-luxe">
            <div className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-pink-100">Offer</div>
            <h2 className="mt-6 font-display text-4xl">{offer.title}</h2>
            <div className="mt-4 text-2xl font-semibold text-caramel">{offer.offer}</div>
            <p className="mt-3 text-base text-pink-100">{offer.detail}</p>
          </div>
        ))}
      </div>
    </main>
  )
}

function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-luxe">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-berry">
            <ShoppingCart className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-display text-4xl text-burgundy">Your cart is empty</h1>
          <p className="mt-3 text-cocoa/70">Add a cake or dessert to begin your celebration order.</p>
          <Link to="/menu" className="mt-6 inline-flex items-center gap-2 rounded-full bg-berry px-5 py-3 text-sm font-semibold text-white">
            Continue shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    )
  }

  const delivery = 149
  const total = subtotal + delivery

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-berry">Cart</p>
        <h1 className="font-display text-5xl text-burgundy">Order summary</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-3 rounded-[1.5rem] border border-burgundy/10 bg-white p-3 shadow-sm sm:p-4">
              <img src={item.image} alt={item.name} className="h-28 w-28 rounded-2xl object-cover" />
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl text-burgundy">{item.name}</h2>
                    <p className="text-xs uppercase tracking-[0.18em] text-cocoa/60">{item.description}</p>
                  </div>
                  <button type="button" className="text-sm font-medium text-berry" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-burgundy/10 bg-cream p-1">
                    <button type="button" className="rounded-full bg-white p-1.5" onClick={() => updateQuantity(item.id, -1)}><Minus className="h-3.5 w-3.5" /></button>
                    <span className="min-w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button type="button" className="rounded-full bg-white p-1.5" onClick={() => updateQuantity(item.id, 1)}><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="font-display text-2xl text-burgundy">{formatPrice(item.price * item.quantity)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-luxe ring-1 ring-burgundy/5">
          <div className="text-xs uppercase tracking-[0.2em] text-berry">Summary</div>
          <div className="mt-6 space-y-3 text-sm text-cocoa/75">
            <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex items-center justify-between"><span>Delivery</span><span>{formatPrice(delivery)}</span></div>
            <div className="flex items-center justify-between border-t border-burgundy/10 pt-3 font-semibold text-cocoa"><span>Total</span><span className="font-display text-3xl text-burgundy">{formatPrice(total)}</span></div>
          </div>

          <button type="button" onClick={() => navigate('/checkout')} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-berry to-pink-500 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-pink-500/25">
            Proceed to checkout <ArrowRight className="h-4 w-4" />
          </button>

          <button type="button" onClick={clearCart} className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-burgundy/10 bg-cream px-5 py-3 text-base font-semibold text-cocoa/75">
            Clear cart
          </button>
        </div>
      </div>
    </main>
  )
}

function CheckoutPage() {
  const { cart, subtotal } = useCart()
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [customerName, setCustomerName] = useState('Aisha')

  if (!cart.length) {
    return <Navigate to="/cart" replace />
  }

  const delivery = 149
  const total = subtotal + delivery

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-berry">Checkout</p>
        <h1 className="font-display text-5xl text-burgundy">Complete your order</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] bg-white p-6 shadow-luxe ring-1 ring-burgundy/5 sm:p-8">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-cocoa">Customer name</label>
              <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="w-full rounded-2xl border border-burgundy/10 bg-cream px-4 py-3 text-base text-cocoa outline-none transition focus:border-berry" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-cocoa">Phone number</label>
              <input type="tel" defaultValue="+91 98765 43210" className="w-full rounded-2xl border border-burgundy/10 bg-cream px-4 py-3 text-base text-cocoa outline-none transition focus:border-berry" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-cocoa">Delivery address</label>
              <textarea defaultValue="Banjara Hills, Hyderabad" rows="3" className="w-full rounded-2xl border border-burgundy/10 bg-cream px-4 py-3 text-base text-cocoa outline-none transition focus:border-berry" />
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold text-cocoa">Payment method</div>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => (
                  <button key={method} type="button" onClick={() => setPaymentMethod(method)} className={`rounded-full border px-3 py-2.5 text-sm font-medium transition ${paymentMethod === method ? 'border-berry bg-pink-50 text-berry' : 'border-burgundy/10 bg-cream text-cocoa/75'}`}>
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#FFF0E8_0%,#ffeaf2_100%)] p-6 shadow-luxe ring-1 ring-burgundy/5 sm:p-8">
          <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
            <div className="text-xs uppercase tracking-[0.2em] text-berry">Payment summary</div>
            <div className="mt-5 space-y-3 text-sm text-cocoa/75">
              <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex items-center justify-between"><span>Delivery</span><span>{formatPrice(delivery)}</span></div>
              <div className="flex items-center justify-between border-t border-burgundy/10 pt-3 font-semibold text-cocoa"><span>Total</span><span className="font-display text-3xl text-burgundy">{formatPrice(total)}</span></div>
            </div>

            <button type="button" onClick={() => navigate('/order-confirmation')} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-berry to-pink-500 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-pink-500/25">
              Place demo order · {paymentMethod}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

function OrderConfirmationPage() {
  const navigate = useNavigate()
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] bg-white p-10 text-center shadow-luxe">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-5xl text-burgundy">Order confirmed</h1>
        <p className="mt-3 text-lg text-cocoa/70">Your demo cake order has been placed successfully.</p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button type="button" onClick={() => navigate('/order-tracking')} className="rounded-full bg-berry px-5 py-3 text-sm font-semibold text-white">Track order</button>
          <button type="button" onClick={() => navigate('/menu')} className="rounded-full border border-burgundy/10 bg-cream px-5 py-3 text-sm font-semibold text-cocoa/75">Continue shopping</button>
        </div>
      </div>
    </main>
  )
}

function OrderTrackingPage() {
  const trackingSteps = [
    { title: 'Order placed', time: 'Today • 10:15 AM', done: true },
    { title: 'Preparing your cake', time: 'Today • 12:20 PM', done: true },
    { title: 'Packed for delivery', time: 'Today • 4:00 PM', done: false },
    { title: 'With rider', time: 'Today • 6:00 PM', done: false },
  ]

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-berry">Order tracking</p>
        <h1 className="font-display text-5xl text-burgundy">Your cake is on the way</h1>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-luxe ring-1 ring-burgundy/5 sm:p-8">
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-cream p-4 text-burgundy">
          <PackageCheck className="h-6 w-6 text-berry" />
          <div>
            <div className="font-semibold">Tracking ID: ENT-24518</div>
            <div className="text-sm text-cocoa/65">Estimated delivery: 6:30 PM</div>
          </div>
        </div>

        <div className="space-y-6">
          {trackingSteps.map((step) => (
            <div key={step.title} className="flex items-start gap-4">
              <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${step.done ? 'bg-berry text-white' : 'bg-cream text-cocoa/50'}`}>
                {step.done ? <Check className="h-4 w-4" /> : <span className="h-2.5 w-2.5 rounded-full bg-current" />}
              </div>
              <div className="flex-1 border-b border-burgundy/10 pb-4">
                <div className="font-semibold text-cocoa">{step.title}</div>
                <div className="text-sm text-cocoa/60">{step.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-berry">Contact</p>
        <h1 className="font-display text-5xl text-burgundy">We’d love to hear from you.</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] bg-burgundy p-7 text-white shadow-luxe sm:p-8">
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-4"><MapPin className="mt-1 h-5 w-5 text-caramel" /> <div><div className="font-medium">EAT N TREAT Bakery Studio</div><p className="text-sm text-pink-100">Banjara Hills, Hyderabad, Telangana</p></div></div>
            <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-4"><Phone className="mt-1 h-5 w-5 text-caramel" /> <div><div className="font-medium">+91 98765 43210</div><p className="text-sm text-pink-100">Call for custom cake consultations</p></div></div>
            <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-4"><MessageCircle className="mt-1 h-5 w-5 text-caramel" /> <div><div className="font-medium">WhatsApp booking</div><p className="text-sm text-pink-100">Quick order updates and custom requests</p></div></div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-luxe ring-1 ring-burgundy/5 sm:p-8">
          <div className="grid gap-4">
            <input placeholder="Your name" className="w-full rounded-2xl border border-burgundy/10 bg-cream px-4 py-3 text-base text-cocoa outline-none focus:border-berry" />
            <input placeholder="Email address" type="email" className="w-full rounded-2xl border border-burgundy/10 bg-cream px-4 py-3 text-base text-cocoa outline-none focus:border-berry" />
            <input placeholder="Phone number" type="tel" className="w-full rounded-2xl border border-burgundy/10 bg-cream px-4 py-3 text-base text-cocoa outline-none focus:border-berry" />
            <textarea placeholder="Tell us about your celebration" rows="5" className="w-full rounded-2xl border border-burgundy/10 bg-cream px-4 py-3 text-base text-cocoa outline-none focus:border-berry" />
            <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-berry to-pink-500 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-pink-500/25">
              Send message <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-berry">Admin</p>
        <h1 className="font-display text-5xl text-burgundy">Bakery operations dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: 'Orders today', value: '134' },
          { label: 'Cake ready', value: '27' },
          { label: 'Revenue demo', value: '₹2.4L' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[2rem] bg-white p-6 text-center shadow-luxe ring-1 ring-burgundy/5">
            <div className="font-display text-4xl text-burgundy">{stat.value}</div>
            <div className="mt-2 uppercase tracking-[0.2em] text-cocoa/65">{stat.label}</div>
          </div>
        ))}
      </div>
    </main>
  )
}

function NotFoundPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] bg-white p-10 text-center shadow-luxe">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-berry"><Search className="h-8 w-8" /></div>
        <h1 className="mt-6 font-display text-5xl text-burgundy">Page not found</h1>
        <p className="mt-3 text-cocoa/70">The page you requested does not exist in the EAT N TREAT boutique.</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-berry px-5 py-3 text-sm font-semibold text-white">
          Back to home <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  )
}

function Footer() {
  return (
    <footer className="bg-burgundy py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-caramel"><CakeSlice className="h-5 w-5" /></div>
            <div>
              <div className="font-display text-2xl font-bold">EAT N TREAT</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-pink-100">Sweet joy, every day</div>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-pink-100">Curating handcrafted cakes and bakery favourites that bring a sense of joy to every celebration.</p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-white">Explore</h3>
          <div className="mt-5 space-y-3 text-sm text-pink-100">
            <div><Link to="/menu">Our Menu</Link></div>
            <div><Link to="/customize">Customize Cake</Link></div>
            <div><Link to="/about">About us</Link></div>
            <div><Link to="/contact">Contact</Link></div>
          </div>
        </div>

        <div>
          <h3 className="font-display text-2xl text-white">Follow us</h3>
          <div className="mt-5 flex items-center gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10"><Camera className="h-4 w-4" /></a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 transition hover:bg-white/10"><MessageCircle className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-4 pt-6 text-center text-sm text-pink-100 sm:px-6 lg:px-8">
        © 2026 EAT N TREAT. Freshly baked happiness.
      </div>
    </footer>
  )
}

function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [customerName, setCustomerName] = useState('Aisha')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const navigate = useNavigate()

  const total = subtotal + 149

  const handlePlaceOrder = () => {
    if (!cart.length) return
    setOrderPlaced(true)
    clearCart()
    setTimeout(() => {
      setOrderPlaced(false)
      setIsCartOpen(false)
      navigate('/order-confirmation')
    }, 1600)
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.aside initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-[#3B1725]/30 backdrop-blur-sm">
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.25 }} className="absolute right-0 flex h-full w-full max-w-xl flex-col bg-[#FFF0E8] text-cocoa shadow-2xl">
            <div className="flex items-center justify-between border-b border-burgundy/10 px-5 py-4 sm:px-6">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-berry">Your cart</div>
                <h3 className="font-display text-3xl text-burgundy">Order summary</h3>
              </div>
              <button type="button" className="rounded-full bg-white p-2 text-cocoa shadow-sm" onClick={() => setIsCartOpen(false)}><X className="h-4 w-4" /></button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center rounded-[1.5rem] bg-white p-8 text-center shadow-sm">
                  <ShoppingCart className="h-12 w-12 text-berry" />
                  <p className="mt-4 font-display text-3xl text-burgundy">Your cart is empty</p>
                  <p className="mt-2 text-sm text-cocoa/70">Add a cake or dessert to begin your celebration order.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-[1.5rem] border border-burgundy/10 bg-white p-3 shadow-sm">
                    <img src={item.image} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-display text-2xl text-burgundy">{item.name}</h4>
                          <p className="text-xs uppercase tracking-[0.18em] text-cocoa/60">{item.description}</p>
                        </div>
                        <button type="button" className="text-sm font-medium text-berry" onClick={() => removeFromCart(item.id)}>Remove</button>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-burgundy/10 bg-cream p-1">
                          <button type="button" className="rounded-full bg-white p-1.5" onClick={() => updateQuantity(item.id, -1)}><Minus className="h-3.5 w-3.5" /></button>
                          <span className="min-w-6 text-center text-sm font-semibold">{item.quantity}</span>
                          <button type="button" className="rounded-full bg-white p-1.5" onClick={() => updateQuantity(item.id, 1)}><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <div className="font-display text-2xl text-burgundy">{formatPrice(item.price * item.quantity)}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {cart.length > 0 && (
                <div className="rounded-[1.5rem] bg-white p-4 shadow-sm">
                  <div className="mb-3 text-xs uppercase tracking-[0.22em] text-berry">Customer details</div>
                  <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Your name" className="w-full rounded-2xl border border-burgundy/10 bg-cream px-4 py-3 text-base text-cocoa outline-none focus:border-berry" />

                  <div className="mt-4">
                    <div className="mb-2 text-sm font-semibold text-cocoa">Payment method</div>
                    <div className="grid grid-cols-2 gap-2">
                      {paymentMethods.map((method) => (
                        <button key={method} type="button" onClick={() => setPaymentMethod(method)} className={`rounded-full border px-3 py-2 text-sm font-medium transition ${paymentMethod === method ? 'border-berry bg-pink-50 text-berry' : 'border-burgundy/10 bg-cream text-cocoa/75'}`}>
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-burgundy/10 bg-white p-5 shadow-inner">
                <div className="space-y-2 text-sm text-cocoa/75">
                  <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex items-center justify-between"><span>Delivery</span><span>{formatPrice(149)}</span></div>
                  <div className="flex items-center justify-between border-t border-burgundy/10 pt-2 font-semibold text-cocoa"><span>Total</span><span className="font-display text-2xl text-burgundy">{formatPrice(total)}</span></div>
                </div>

                <button type="button" onClick={handlePlaceOrder} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-berry to-pink-500 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-pink-500/25">
                  {orderPlaced ? 'Order placed!' : `Place demo order · ${paymentMethod}`}
                </button>
              </div>
            )}
          </motion.div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function CakeScene() {
  return (
    <div className="pointer-events-none h-[430px] w-full">
      <Canvas camera={{ position: [0, 1.4, 5.5], fov: 35 }}>
        <ambientLight intensity={1.4} />
        <directionalLight position={[3, 5, 2]} intensity={1.5} color="#fff3f4" />
        <spotLight position={[-3, 5, 4]} intensity={35} angle={0.6} penumbra={1} color="#ffb6c8" />
        <Float floatIntensity={1.2} speed={1.8}>
          <CakeModel />
        </Float>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.6} />
      </Canvas>
    </div>
  )
}

function CakeModel() {
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const { pointer, clock } = state
    groupRef.current.rotation.y += delta * 0.5
    groupRef.current.rotation.x = pointer.y * 0.35
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 1.8) * 0.12
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, -1.1, 0]} receiveShadow>
        <cylinderGeometry args={[2.3, 2.5, 0.55, 64]} />
        <meshStandardMaterial color="#e7b993" metalness={0.2} roughness={0.45} />
      </mesh>
      <mesh position={[0, -0.15, 0]} castShadow>
        <cylinderGeometry args={[1.9, 2.1, 1.2, 64]} />
        <meshStandardMaterial color="#4a1d1e" roughness={0.7} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[1.65, 1.75, 1.05, 64]} />
        <meshStandardMaterial color="#4f1f1f" roughness={0.7} metalness={0.15} />
      </mesh>
      <mesh position={[0, 1.65, 0]} castShadow>
        <cylinderGeometry args={[1.35, 1.5, 0.6, 64]} />
        <meshStandardMaterial color="#fff2f2" roughness={0.5} metalness={0.1} />
      </mesh>
      {[[-0.8, 1.8, 0.5], [0.8, 1.9, -0.3], [0.25, 2.1, 0.8], [-0.35, 2.25, -0.7]].map(([x, y, z], index) => (
        <mesh key={`${x}-${y}`} position={[x, y, z]}>
          <sphereGeometry args={[0.23, 32, 32]} />
          <meshStandardMaterial color={index % 2 === 0 ? '#d7205f' : '#ff6f91'} roughness={0.2} metalness={0.1} />
        </mesh>
      ))}
      {[[-0.9, 0.2, 0.55], [0.8, 0.1, -0.6], [1.05, 0.85, 0.2], [-1.0, 0.75, -0.4]].map(([x, y, z], index) => (
        <mesh key={`${x}-${y}-${z}`} position={[x, y, z]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial color={index % 2 === 0 ? '#8b5a2b' : '#c46c2c'} />
        </mesh>
      ))}
      {[-1, 0, 1].map((x) => (
        <mesh key={x} position={[x * 0.7, 1.7, 0.75]} rotation={[0, 0, 0.8]}>
          <torusGeometry args={[0.2, 0.08, 16, 64]} />
          <meshStandardMaterial color="#FFB6C8" />
        </mesh>
      ))}
    </group>
  )
}

export default function RootApp() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  )
}
