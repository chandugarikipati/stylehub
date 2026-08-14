import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useApp } from "../context/AppContext";

// =====================================================
// TYPES
// =====================================================

type AddressType =
  | "Home"
  | "Work"
  | "Other";

interface SavedAddress {
  _id?: string;
  userId?: string;

  type:
    | "Home"
    | "Work"
    | "Other";

  name: string;
  phone: string;
  additionalPhone?: string;

  address: string;
  city: string;
  state: string;
  pincode: string;

  createdAt?: string;
  updatedAt?: string;
}

interface AddressForm {
  name: string;
  email: string;
  phone: string;
  additionalPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

// =====================================================
// COMPONENT
// =====================================================

export default function Checkout() {
  const navigate =
    useNavigate();

  const {
  cartItems,
  cartTotal,
  clearCart,
  createOrder,
  user,
  showToast,
} = useApp();

  // ===================================================
  // PAYMENT
  // ===================================================

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("cod");

  // ===================================================
  // ORDER
  // ===================================================

  const [
    placingOrder,
    setPlacingOrder,
  ] = useState(false);

  const [
    orderPlaced,
    setOrderPlaced,
  ] = useState(false);

  // ===================================================
  // ADDRESS
  // ===================================================

  const [
    addressType,
    setAddressType,
  ] =
    useState<AddressType>("Home");

  const [
    savedAddresses,
    setSavedAddresses,
  ] =
    useState<
      Record<
        string,
        SavedAddress
      >
    >({});

  const [
    loadingAddresses,
    setLoadingAddresses,
  ] = useState(false);

  const [
    savingAddress,
    setSavingAddress,
  ] = useState(false);

  // ===================================================
  // LOCATION
  // ===================================================

  const [
    gettingLocation,
    setGettingLocation,
  ] = useState(false);

  const [
    currentLocation,
    setCurrentLocation,
  ] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // ===================================================
  // FORM
  // ===================================================

  const [form, setForm] =
    useState<AddressForm>({
      name:
        user?.name || "",
      email:
        user?.email || "",
      phone:
        user?.phone || "",
      additionalPhone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

  // ===================================================
  // DEBUG USER
  // ===================================================

  useEffect(() => {
    console.log(
      "========== CHECKOUT USER =========="
    );

    console.log(
      "USER:",
      user
    );

    console.log(
      "USER ID:",
      user?.id
    );

    if (user?.id) {
      console.log(
        "âœ… Checkout has MongoDB user ID:",
        user.id
      );
    } else {
      console.log(
        "âŒ Checkout has NO user ID"
      );
    }
  }, [user]);

  // ===================================================
  // UPDATE USER DETAILS
  // ===================================================

  useEffect(() => {
    setForm(
      (previous) => ({
        ...previous,

        name:
          user?.name ||
          previous.name,

        email:
          user?.email ||
          previous.email,

        phone:
          user?.phone ||
          previous.phone,
      })
    );
  }, [user]);

  // ===================================================
  // LOAD ADDRESSES FROM MONGODB
  // ===================================================

  useEffect(() => {
    const loadAddresses =
      async () => {
        if (!user?.id) {
          console.log(
            "âŒ No logged-in user ID available."
          );

          setSavedAddresses(
            {}
          );

          return;
        }

        try {
          setLoadingAddresses(
            true
          );

          const url =
            `${API_BASE_URL}/users/${user.id}/addresses`;

          console.log(
            "GET ADDRESSES:",
            url
          );

          const response =
            await fetch(url);

          const data =
            await response.json();

          console.log(
            "GET ADDRESSES RESPONSE:",
            data
          );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                "Failed to load saved addresses."
            );
          }

          const addresses:
            SavedAddress[] =
            Array.isArray(data)
              ? data
              : Array.isArray(
                  data?.addresses
                )
              ? data.addresses
              : [];

          const addressMap:
            Record<
              string,
              SavedAddress
            > = {};

          addresses.forEach(
            (address) => {
              if (
                address?.type
              ) {
                addressMap[
                  address.type
                ] = address;
              }
            }
          );

          setSavedAddresses(
            addressMap
          );

          // Automatically select first saved address.
          const firstAddress =
            addressMap.Home ||
            addressMap.Work ||
            addressMap.Other;

          if (firstAddress) {
            setAddressType(
              firstAddress.type
            );

            setForm(
              (previous) => ({
                ...previous,

                name:
                  firstAddress.name ||
                  previous.name,

                phone:
                  firstAddress.phone ||
                  previous.phone,

                additionalPhone:
                  firstAddress.additionalPhone ||
                  "",

                address:
                  firstAddress.address ||
                  "",

                city:
                  firstAddress.city ||
                  "",

                state:
                  firstAddress.state ||
                  "",

                pincode:
                  firstAddress.pincode ||
                  "",
              })
            );
          }
        } catch (error) {
          console.error(
            "LOAD ADDRESSES ERROR:",
            error
          );

          showToast(
            error instanceof Error
              ? error.message
              : "Unable to load addresses.",
            "error"
          );
        } finally {
          setLoadingAddresses(
            false
          );
        }
      };

    loadAddresses();
  }, [
    user?.id,
    showToast,
  ]);

  // ===================================================
  // TOTALS
  // ===================================================

  const shipping =
    cartTotal >= 3000
      ? 0
      : 99;

  const total =
    cartTotal + shipping;

  // ===================================================
  // GOOGLE MAP URL
  // ===================================================

  const googleMapsUrl =
    useMemo(() => {
      if (currentLocation) {
        return (
          `https://www.google.com/maps/search/?api=1&query=` +
          `${currentLocation.latitude},${currentLocation.longitude}`
        );
      }

      const query = [
        form.address,
        form.city,
        form.state,
        form.pincode,
      ]
        .filter(Boolean)
        .join(", ");

      if (query) {
        return (
          "https://www.google.com/maps/search/?api=1&query=" +
          encodeURIComponent(query)
        );
      }

      return "https://www.google.com/maps";
    }, [
      currentLocation,
      form.address,
      form.city,
      form.state,
      form.pincode,
    ]);

  // ===================================================
  // GOOGLE MAP EMBED
  // ===================================================

  const googleMapsEmbedUrl =
    useMemo(() => {
      if (currentLocation) {
        return (
          `https://www.google.com/maps?q=` +
          `${currentLocation.latitude},${currentLocation.longitude}` +
          `&z=16&output=embed`
        );
      }

      const query = [
        form.address,
        form.city,
        form.state,
        form.pincode,
      ]
        .filter(Boolean)
        .join(", ");

      if (query) {
        return (
          "https://www.google.com/maps?q=" +
          encodeURIComponent(query) +
          "&output=embed"
        );
      }

      return "";
    }, [
      currentLocation,
      form.address,
      form.city,
      form.state,
      form.pincode,
    ]);

  // ===================================================
  // INPUT CHANGE
  // ===================================================

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    if (
      [
        "address",
        "city",
        "state",
        "pincode",
      ].includes(name)
    ) {
      setCurrentLocation(
        null
      );
    }
  };

  // ===================================================
  // SELECT SAVED ADDRESS
  // ===================================================

  const selectSavedAddress =
    (type: AddressType) => {
      setAddressType(type);

      const saved =
        savedAddresses[type];

      if (!saved) {
        return;
      }

      setForm(
        (previous) => ({
          ...previous,

          name:
            saved.name ||
            previous.name,

          phone:
            saved.phone ||
            previous.phone,

          additionalPhone:
            saved.additionalPhone ||
            "",

          address:
            saved.address ||
            "",

          city:
            saved.city ||
            "",

          state:
            saved.state ||
            "",

          pincode:
            saved.pincode ||
            "",
        })
      );

      setCurrentLocation(
        null
      );

      showToast(
        `${type} address selected.`,
        "info"
      );
    };

  // ===================================================
  // CHANGE ADDRESS TYPE
  // ===================================================

  const changeAddressType =
    (type: AddressType) => {
      setAddressType(type);

      const saved =
        savedAddresses[type];

      if (saved) {
        selectSavedAddress(
          type
        );

        return;
      }

      setForm(
        (previous) => ({
          ...previous,

          address: "",
          city: "",
          state: "",
          pincode: "",
          additionalPhone:
            "",
        })
      );

      setCurrentLocation(
        null
      );
    };

  // ===================================================
  // CURRENT LOCATION
  // ===================================================

  const useCurrentLocation =
    () => {
      if (
        !navigator.geolocation
      ) {
        showToast(
          "Location services are not supported by this browser.",
          "error"
        );

        return;
      }

      setGettingLocation(
        true
      );

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          setCurrentLocation(
            {
              latitude,
              longitude,
            }
          );

          setGettingLocation(
            false
          );

          showToast(
            "Current location detected successfully!",
            "success"
          );
        },
        (error) => {
          console.error(
            "LOCATION ERROR:",
            error
          );

          setGettingLocation(
            false
          );

          if (
            error.code === 1
          ) {
            showToast(
              "Location permission was denied.",
              "error"
            );
          } else if (
            error.code === 2
          ) {
            showToast(
              "Unable to detect your location.",
              "error"
            );
          } else {
            showToast(
              "Location request timed out.",
              "error"
            );
          }
        },
        {
          enableHighAccuracy:
            true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

  // ===================================================
  // SAVE ADDRESS TO MONGODB
  // ===================================================

  const saveCurrentAddress =
    async () => {
      console.log(
        "===================================="
      );

      console.log(
        "========== SAVE ADDRESS =========="
      );

      console.log(
        "USER:",
        user
      );

      console.log(
        "USER ID:",
        user?.id
      );

      // -------------------------------------------------
      // USER CHECK
      // -------------------------------------------------

      if (!user?.id) {
        showToast(
          "You are not logged in. Please logout and login again.",
          "error"
        );

        return;
      }

      // -------------------------------------------------
      // VALIDATION
      // -------------------------------------------------

      if (
        !form.name.trim() ||
        !form.address.trim() ||
        !form.city.trim() ||
        !form.state.trim() ||
        !form.pincode.trim() ||
        !form.phone.trim()
      ) {
        showToast(
          "Please complete all required address fields.",
          "error"
        );

        return;
      }

      if (
        !/^\d{10}$/.test(
          form.phone.trim()
        )
      ) {
        showToast(
          "Please enter a valid 10-digit mobile number.",
          "error"
        );

        return;
      }

      if (
        !/^\d{6}$/.test(
          form.pincode.trim()
        )
      ) {
        showToast(
          "Please enter a valid 6-digit pincode.",
          "error"
        );

        return;
      }

      if (
        form.additionalPhone.trim() &&
        !/^\d{10}$/.test(
          form.additionalPhone.trim()
        )
      ) {
        showToast(
          "Additional mobile number must contain 10 digits.",
          "error"
        );

        return;
      }

      // -------------------------------------------------
      // START SAVING
      // -------------------------------------------------

      try {
        setSavingAddress(
          true
        );

        const addressData =
          {
            type: addressType,

            name:
              form.name.trim(),

            phone:
              form.phone.trim(),

            additionalPhone:
              form.additionalPhone.trim(),

            address:
              form.address.trim(),

            city:
              form.city.trim(),

            state:
              form.state.trim(),

            pincode:
              form.pincode.trim(),
          };

        console.log(
          "ADDRESS DATA:",
          addressData
        );

        const url =
          `${API_BASE_URL}/users/${user.id}/addresses`;

        console.log(
          "POST URL:",
          url
        );

        const response =
          await fetch(url, {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              addressData
            ),
          });

        console.log(
          "RESPONSE STATUS:",
          response.status
        );

        const data =
          await response.json();

        console.log(
          "SAVE ADDRESS RESPONSE:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to save address."
          );
        }

        const savedAddress:
          SavedAddress =
          data.address;

        // Update screen immediately.
        setSavedAddresses(
          (previous) => ({
            ...previous,

            [addressType]:
              savedAddress,
          })
        );

        showToast(
          data?.message ||
            `${addressType} address saved successfully!`,
          "success"
        );

        console.log(
          "âœ… ADDRESS SAVED SUCCESSFULLY"
        );

      } catch (error) {
        console.error(
          "âŒ SAVE ADDRESS ERROR:",
          error
        );

        showToast(
          error instanceof Error
            ? error.message
            : "Unable to save address.",
          "error"
        );
      } finally {
        setSavingAddress(
          false
        );
      }
    };

  // ===================================================
  // PLACE ORDER
  // ===================================================

  const handleSubmit =
    (
      event: React.FormEvent
    ) => {
      event.preventDefault();

      if (
        cartItems.length === 0
      ) {
        return;
      }

      if (
        !form.name.trim() ||
        !form.email.trim()
      ) {
        showToast(
          "Please check your account details.",
          "error"
        );

        return;
      }

      if (
        !form.address.trim() ||
        !form.city.trim() ||
        !form.state.trim() ||
        !form.pincode.trim()
      ) {
        showToast(
          "Please complete your delivery location.",
          "error"
        );

        return;
      }

      if (
        !/^\d{6}$/.test(
          form.pincode.trim()
        )
      ) {
        showToast(
          "Please enter a valid 6-digit pincode.",
          "error"
        );

        return;
      }

      if (
        !form.phone.trim()
      ) {
        showToast(
          "Please enter a delivery mobile number.",
          "error"
        );

        return;
      }

      if (
        !/^\d{10}$/.test(
          form.phone.trim()
        )
      ) {
        showToast(
          "Please enter a valid 10-digit mobile number.",
          "error"
        );

        return;
      }

      setPlacingOrder(
        true
      );

      setTimeout(() => {
        setPlacingOrder(
          false
        );

        const order = createOrder();

        if (!order) {
          showToast(
            "Unable to create your order. Please try again.",
            "error"
          );

          setPlacingOrder(false);
          return;
        }

        setOrderPlaced(
          true
        );

        showToast(
          "Order placed successfully!",
          "success"
        );
      }, 1000);
    };

  // ===================================================
  // ORDER SUCCESS
  // ===================================================

  if (orderPlaced) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">

          <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-4xl mx-auto mb-6">
            âœ“
          </div>

          <h1 className="font-display text-3xl font-semibold">
            Order Placed Successfully!
          </h1>

          <p className="text-charcoal-500 mt-3">
            Thank you for shopping with StyleHub.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/products"
              )
            }
            className="mt-8 bg-charcoal text-white px-8 py-3 rounded-xl hover:bg-gold hover:text-charcoal transition"
          >
            Continue Shopping
          </button>

        </div>
      </div>
    );
  }

  // ===================================================
  // EMPTY CART
  // ===================================================

  if (
    cartItems.length === 0
  ) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">

          <h1 className="font-display text-3xl font-semibold">
            Your cart is empty
          </h1>

          <p className="text-charcoal-400 mt-2 mb-6">
            Add products before proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="inline-block bg-charcoal text-white px-8 py-3 rounded-xl"
          >
            Browse Products
          </Link>

        </div>
      </div>
    );
  }

  // ===================================================
  // CHECKOUT UI
  // ===================================================

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

      <h1 className="font-display text-3xl font-semibold mb-10">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-[1fr_380px] gap-10"
      >

        {/* LEFT */}
        <div className="space-y-8">

          {/* CONTACT */}
          <section className="border border-charcoal-100 rounded-2xl p-6">

            <h2 className="font-display text-xl font-semibold mb-6">
              Contact Information
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>

                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={
                    handleChange
                  }
                  placeholder="Full Name"
                  className="w-full border border-charcoal-200 rounded-xl px-4 py-3 outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>

                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={
                    handleChange
                  }
                  placeholder="Email"
                  className="w-full border border-charcoal-200 rounded-xl px-4 py-3 outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Delivery Mobile Number
                </label>

                <input
                  required
                  name="phone"
                  value={form.phone}
                  onChange={
                    handleChange
                  }
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  className="w-full border border-charcoal-200 rounded-xl px-4 py-3 outline-none focus:border-charcoal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Additional Mobile{" "}
                  <span className="text-charcoal-400 font-normal">
                    (Optional)
                  </span>
                </label>

                <input
                  name="additionalPhone"
                  value={
                    form.additionalPhone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Backup number"
                  inputMode="numeric"
                  maxLength={10}
                  className="w-full border border-charcoal-200 rounded-xl px-4 py-3 outline-none focus:border-charcoal"
                />
              </div>

            </div>

          </section>

          {/* DELIVERY */}
          <section className="border border-charcoal-100 rounded-2xl p-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

              <div>

                <h2 className="font-display text-xl font-semibold">
                  ðŸ“ Delivery Location
                </h2>

                <p className="text-sm text-charcoal-400 mt-1">
                  Enter your address and save it to your StyleHub profile.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  useCurrentLocation
                }
                disabled={
                  gettingLocation
                }
                className="bg-charcoal text-white rounded-xl px-5 py-3 text-sm font-semibold hover:bg-gold hover:text-charcoal transition disabled:opacity-60"
              >
                {gettingLocation
                  ? "â³ Detecting..."
                  : "ðŸ“ Use My Location"}
              </button>

            </div>

            {/* SAVED ADDRESS BUTTONS */}
            <div className="mb-6">

              <div className="flex items-center justify-between mb-3">

                <h3 className="text-sm font-semibold">
                  Saved Addresses
                </h3>

                {loadingAddresses && (
                  <span className="text-xs text-charcoal-400">
                    Loading...
                  </span>
                )}

              </div>

              {Object.keys(
                savedAddresses
              ).length > 0 ? (

                <div className="flex flex-wrap gap-3">

                  {(
                    [
                      "Home",
                      "Work",
                      "Other",
                    ] as AddressType[]
                  ).map(
                    (type) =>
                      savedAddresses[
                        type
                      ] && (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            selectSavedAddress(
                              type
                            )
                          }
                          className={`px-5 py-3 rounded-xl border transition ${
                            addressType ===
                            type
                              ? "bg-charcoal text-white border-charcoal"
                              : "border-charcoal-200 hover:border-charcoal"
                          }`}
                        >
                          <span className="font-semibold">
                            {type}
                          </span>

                          <span className="block text-xs mt-1 opacity-70">
                            {
                              savedAddresses[
                                type
                              ]?.city
                            }
                          </span>
                        </button>
                      )
                  )}

                </div>

              ) : (

                <p className="text-sm text-charcoal-400">
                  No saved addresses yet.
                </p>

              )}

            </div>

            {/* MAP */}
            <div className="mb-6">

              <div className="overflow-hidden rounded-2xl border border-charcoal-200">

                {googleMapsEmbedUrl ? (

                  <iframe
                    title="Delivery location map"
                    src={
                      googleMapsEmbedUrl
                    }
                    className="w-full h-72 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />

                ) : (

                  <div className="h-72 flex items-center justify-center text-center">

                    <div>
                      <div className="text-5xl mb-3">
                        ðŸ—ºï¸
                      </div>

                      <p className="font-semibold">
                        Enter your address
                      </p>

                      <p className="text-sm text-charcoal-400 mt-2">
                        Map preview will appear here.
                      </p>
                    </div>

                  </div>

                )}

              </div>

              {currentLocation && (
                <div className="mt-3 bg-green-50 border border-green-100 text-green-700 rounded-xl px-4 py-3">
                  âœ“ Current location detected
                  <div className="text-xs mt-1">
                    {currentLocation.latitude.toFixed(
                      5
                    )}
                    ,{" "}
                    {currentLocation.longitude.toFixed(
                      5
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* ADDRESS INPUTS */}
            <div className="space-y-4">

              <div>

                <label className="block text-sm font-medium mb-2">
                  House / Flat / Street / Landmark
                </label>

                <input
                  required
                  name="address"
                  value={form.address}
                  onChange={
                    handleChange
                  }
                  placeholder="House / Flat / Street / Landmark"
                  className="w-full border border-charcoal-200 rounded-xl px-4 py-3 outline-none focus:border-charcoal"
                />

              </div>

              <div className="grid sm:grid-cols-3 gap-4">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    City
                  </label>

                  <input
                    required
                    name="city"
                    value={form.city}
                    onChange={
                      handleChange
                    }
                    placeholder="City"
                    className="w-full border border-charcoal-200 rounded-xl px-4 py-3 outline-none focus:border-charcoal"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    State
                  </label>

                  <input
                    required
                    name="state"
                    value={form.state}
                    onChange={
                      handleChange
                    }
                    placeholder="State"
                    className="w-full border border-charcoal-200 rounded-xl px-4 py-3 outline-none focus:border-charcoal"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Pincode
                  </label>

                  <input
                    required
                    name="pincode"
                    value={
                      form.pincode
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="6-digit pincode"
                    inputMode="numeric"
                    maxLength={6}
                    className="w-full border border-charcoal-200 rounded-xl px-4 py-3 outline-none focus:border-charcoal"
                  />

                </div>

              </div>

              {/* ADDRESS TYPE */}
              <div className="pt-2">

                <label className="block text-sm font-medium mb-3">
                  Save Address As
                </label>

                <div className="flex flex-wrap gap-3">

                  {(
                    [
                      "Home",
                      "Work",
                      "Other",
                    ] as AddressType[]
                  ).map(
                    (type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          changeAddressType(
                            type
                          )
                        }
                        className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition ${
                          addressType ===
                          type
                            ? "bg-charcoal text-white border-charcoal"
                            : "border-charcoal-200 hover:border-charcoal"
                        }`}
                      >
                        {type}
                      </button>
                    )
                  )}

                </div>

              </div>

              {/* SAVE ADDRESS */}
              <button
                type="button"
                onClick={
                  saveCurrentAddress
                }
                disabled={
                  savingAddress
                }
                className="w-full flex items-center justify-center gap-2 bg-charcoal text-white rounded-xl px-4 py-3 font-semibold hover:bg-gold hover:text-charcoal transition disabled:opacity-60"
              >
                {savingAddress
                  ? "â³ Saving Address..."
                  : `ðŸ’¾ Save ${addressType} Address`}
              </button>

              {/* GOOGLE MAPS */}
              <a
                href={
                  googleMapsUrl
                }
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-charcoal-200 rounded-xl px-4 py-3 font-medium hover:bg-charcoal hover:text-white transition"
              >
                ðŸ—ºï¸ Open Location in Google Maps
              </a>

            </div>

          </section>

          {/* PAYMENT */}
          <section className="border border-charcoal-100 rounded-2xl p-6">

            <h2 className="font-display text-xl font-semibold mb-6">
              Payment Method
            </h2>

            <div className="space-y-3">

              <label className="flex items-center gap-3 border border-charcoal-200 rounded-xl p-4 cursor-pointer">

                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={
                    paymentMethod ===
                    "cod"
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target
                        .value
                    )
                  }
                />

                <div>

                  <p className="font-medium">
                    Cash on Delivery
                  </p>

                  <p className="text-xs text-charcoal-400">
                    Pay when your order arrives.
                  </p>

                </div>

              </label>

              <label className="flex items-center gap-3 border border-charcoal-200 rounded-xl p-4 cursor-pointer">

                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={
                    paymentMethod ===
                    "online"
                  }
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target
                        .value
                    )
                  }
                />

                <div>

                  <p className="font-medium">
                    Online Payment
                  </p>

                  <p className="text-xs text-charcoal-400">
                    Payment gateway can be connected later.
                  </p>

                </div>

              </label>

            </div>

          </section>

        </div>

        {/* ORDER SUMMARY */}
        <div className="border border-charcoal-100 rounded-2xl p-6 h-fit sticky top-28">

          <h2 className="font-display text-xl font-semibold mb-6">
            Your Order
          </h2>

          <div className="space-y-4">

            {cartItems.map(
              (item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex gap-3"
                >

                  <img
                    src={
                      item.product
                        .image
                    }
                    alt={
                      item.product
                        .name
                    }
                    className="w-16 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1">

                    <p className="text-sm font-medium">
                      {
                        item.product
                          .name
                      }
                    </p>

                    <p className="text-xs text-charcoal-400 mt-1">
                      {item.size} /{" "}
                      {item.color}
                    </p>

                    <p className="text-xs text-charcoal-400">
                      Qty:{" "}
                      {item.qty}
                    </p>

                  </div>

                  <span className="text-sm font-semibold">
                    â‚¹
                    {(
                      Number(
                        item.product
                          .price
                      ) *
                      Number(
                        item.qty
                      )
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>
              )
            )}

          </div>

          <div className="border-t border-charcoal-100 mt-6 pt-5 space-y-3">

            <div className="flex justify-between text-sm">

              <span className="text-charcoal-500">
                Subtotal
              </span>

              <span>
                â‚¹
                {cartTotal.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

            <div className="flex justify-between text-sm">

              <span className="text-charcoal-500">
                Shipping
              </span>

              <span>
                {shipping ===
                0
                  ? "FREE"
                  : `â‚¹${shipping}`}
              </span>

            </div>

            <div className="border-t border-charcoal-100 pt-4 flex justify-between font-semibold text-lg">

              <span>
                Total
              </span>

              <span>
                â‚¹
                {total.toLocaleString(
                  "en-IN"
                )}
              </span>

            </div>

          </div>

          <button
            type="submit"
            disabled={
              placingOrder
            }
            className="w-full mt-7 bg-charcoal text-white py-4 rounded-xl font-semibold uppercase tracking-wider hover:bg-gold hover:text-charcoal transition disabled:opacity-50"
          >
            {placingOrder
              ? "Placing Order..."
              : "Place Order"}
          </button>

          <Link
            to="/cart"
            className="block text-center text-sm text-charcoal-500 hover:text-charcoal mt-5"
          >
            â† Back to Cart
          </Link>

        </div>

      </form>

    </div>
  );
}
