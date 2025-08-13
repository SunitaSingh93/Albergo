import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   // Try to load from localStorage for persistence
//   const [user, setUser] = useState(() => {
//     const stored = localStorage.getItem("albergo_user");
//     return stored ? JSON.parse(stored) : null;
//   });

//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem("albergo_user", JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("albergo_user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }




export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("albergo_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {

    localStorage.clear();

    setUser(userData);
    localStorage.setItem("albergo_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("albergo_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}



// import { createContext, useContext, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [token, setToken] = useState(localStorage.getItem("token") || null);
//     const [role, setRole] = useState(localStorage.getItem("role") || null);
//     const [name, setName] = useState(localStorage.getItem("name") || null);

//     let parsedUser = null;
//     try {
//         parsedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
//     } catch (err) {
//         console.error("Error parsing user from localStorage", err);
//         localStorage.removeItem("user");
//     }

//     const [user, setUser] = useState(parsedUser);

//     const login = ({ token, role, name }) => {
//         setToken(token);
//         setRole(role);
//         setName(name);

//         localStorage.setItem("token", token);
//         localStorage.setItem("role", role);
//         localStorage.setItem("name", name);
//     };

//     const logout = () => {
//         setToken(null);
//         setRole(null);
//         setUser(null);
//         localStorage.clear();
//     };

//     const isLoggedIn = !!token;

//     return (
//         <AuthContext.Provider value={{ token, role, name, login, logout, isLoggedIn }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => useContext(AuthContext);