import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Authentication
    'welcome_back': 'Welcome Back',
    'email': 'Email',
    'password': 'Password',
    'login': 'Login',
    'forgot_password': 'Forgot Password?',
    'remember_me': 'Remember me',
    'dont_have_account': "Don't have an account?",
    'sign_up': 'Sign Up',
    'create_account': 'Create New Account',
    'full_name': 'Full Name',
    'phone_number': 'Phone Number',
    'confirm_password': 'Confirm Password',
    'terms_agreement': 'I Agree with',
    'terms_of_service': 'Term of service',
    'privacy_policy': 'privacy policy',
    'already_have_account': 'Already have an account?',
    'otp_verification': 'OTP Code Verification',
    'otp_sent': 'Code has been sent to',
    'verify': 'Verify',
    'resend_code': 'Resend Code',
    
    // Navigation
    'home': 'Home',
    'orders': 'Orders',
    'profile': 'Profile',
    'completed': 'Completed',
    'pending': 'Pending',
    'faq': 'FAQ',
    'contact_us': 'Contact Us',
    
    // Profile
    'my_profile': 'My Profile',
    'language': 'Language',
    'address': 'Address',
    'payment_methods': 'Payment Methods',
    'notifications': 'Notifications',
    'help_center': 'Help Center',
    'about': 'About',
    'logout': 'Logout',
    
    // Cart
    'cart': 'Cart',
    'cart_empty': 'Your Cart is Empty',
    'cart_empty_description': 'Add some delicious items to your cart to get started',
    'checkout': 'Checkout',
    'clear_cart': 'Clear Cart',
    
    // Address
    'add_address': 'Add Address',
    'edit_address': 'Edit Address',
    'label': 'Label',
    'address_label_placeholder': 'e.g., Home, Office, etc.',
    'full_address': 'Full Address',
    'address_placeholder': 'Enter complete address',
    'set_default_address': 'Set as default address',
    
    // General
    'cancel': 'Cancel',
    'save': 'Save',
    'edit': 'Edit',
    'delete': 'Delete',
    'ok': 'OK',
    'success': 'Success',
    'error': 'Error',
    'info': 'Info',
    'update': 'Update',
    'add': 'Add',
    'remove': 'Remove',
    'close': 'Close',
    'search': 'Search',
    'filter': 'Filter',
    'sort': 'Sort',
    'promo': 'Promo',
    'apply': 'Apply',
    'clear': 'Clear',
    'clear_all': 'Clear All',
  },
  fr: {
    // Authentication
    'welcome_back': 'Content de te revoir',
    'email': 'Email',
    'password': 'Mot de passe',
    'login': 'Se connecter',
    'forgot_password': 'Mot de passe oublié?',
    'remember_me': 'Se souvenir de moi',
    'dont_have_account': "Vous n'avez pas de compte?",
    'sign_up': "S'inscrire",
    'create_account': 'Créer un nouveau compte',
    'full_name': 'Nom complet',
    'phone_number': 'Numéro de téléphone',
    'confirm_password': 'Confirmer le mot de passe',
    'terms_agreement': "J'accepte les",
    'terms_of_service': "Conditions d'utilisation",
    'privacy_policy': 'politique de confidentialité',
    'already_have_account': 'Vous avez déjà un compte?',
    'otp_verification': 'Vérification du code OTP',
    'otp_sent': 'Le code a été envoyé à',
    'verify': 'Vérifier',
    'resend_code': 'Renvoyer le code',
    
    // Navigation
    'home': 'Accueil',
    'orders': 'Commandes',
    'profile': 'Profil',
    'completed': 'Terminé',
    'pending': 'En attente',
    'faq': 'FAQ',
    'contact_us': 'Contactez-nous',
    
    // Profile
    'my_profile': 'Mon profil',
    'language': 'Langue',
    'address': 'Adresse',
    'payment_methods': 'Moyens de paiement',
    'notifications': 'Notifications',
    'help_center': 'Centre d\'aide',
    'about': 'À propos',
    'logout': 'Se déconnecter',
    
    // Cart
    'cart': 'Panier',
    'cart_empty': 'Votre panier est vide',
    'cart_empty_description': 'Ajoutez des articles délicieux à votre panier pour commencer',
    'checkout': 'Commander',
    'clear_cart': 'Vider le panier',
    
    // Address
    'add_address': 'Ajouter une adresse',
    'edit_address': 'Modifier l\'adresse',
    'label': 'Étiquette',
    'address_label_placeholder': 'ex: Maison, Bureau, etc.',
    'full_address': 'Adresse complète',
    'address_placeholder': 'Entrez l\'adresse complète',
    'set_default_address': 'Définir comme adresse par défaut',
    
    // General
    'cancel': 'Annuler',
    'save': 'Sauvegarder',
    'edit': 'Modifier',
    'delete': 'Supprimer',
    'ok': 'OK',
    'success': 'Succès',
    'error': 'Erreur',
    'info': 'Info',
    'update': 'Mettre à jour',
    'add': 'Ajouter',
    'remove': 'Retirer',
    'close': 'Fermer',
    'search': 'Rechercher',
    'filter': 'Filtrer',
    'sort': 'Trier',
    'promo': 'Promo',
    'apply': 'Appliquer',
    'clear': 'Effacer',
    'clear_all': 'Tout effacer',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load saved language preference
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('app-language');
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      }
    };

    loadLanguage();
  }, []);

  const changeLanguage = async (newLanguage: Language) => {
    try {
      setLanguage(newLanguage);
      await AsyncStorage.setItem('app-language', newLanguage);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

