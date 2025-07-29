<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api', name: 'api_')]
class AuthController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator
    ) {}

    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(Request $request, UserRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validation des données
        if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Nom, email et mot de passe sont requis'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Validation de l'email
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Format d\'email invalide'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Validation de la longueur du mot de passe
        if (strlen($data['password']) < 6) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Le mot de passe doit contenir au moins 6 caractères'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Vérifier si l'email existe déjà
        if ($userRepository->emailExists($data['email'])) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Cet email est déjà utilisé'
            ], Response::HTTP_CONFLICT);
        }

        try {
            // Créer le nouvel utilisateur
            $user = new User();
            $user->setName(trim($data['name']));
            $user->setEmail(strtolower(trim($data['email'])));
            
            // Hasher le mot de passe
            $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);

            // Valider l'entité
            $errors = $this->validator->validate($user);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[] = $error->getMessage();
                }
                return new JsonResponse([
                    'success' => false,
                    'message' => implode(', ', $errorMessages)
                ], Response::HTTP_BAD_REQUEST);
            }

            // Sauvegarder en base
            $this->entityManager->persist($user);
            $this->entityManager->flush();

            // Retourner les données utilisateur (sans le mot de passe)
            $userData = [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'email' => $user->getEmail(),
                'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i:s')
            ];

            return new JsonResponse([
                'success' => true,
                'message' => 'Compte créé avec succès',
                'user' => $userData
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Erreur lors de la création du compte'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validation des données
        if (!isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Email et mot de passe sont requis'
            ], Response::HTTP_BAD_REQUEST);
        }

        try {
            // Rechercher l'utilisateur par email
            $user = $userRepository->findByEmail(strtolower(trim($data['email'])));

            if (!$user) {
                return new JsonResponse([
                    'success' => false,
                    'message' => 'Identifiants invalides'
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Vérifier le mot de passe
            if (!$this->passwordHasher->isPasswordValid($user, $data['password'])) {
                return new JsonResponse([
                    'success' => false,
                    'message' => 'Identifiants invalides'
                ], Response::HTTP_UNAUTHORIZED);
            }

            // Connexion réussie - retourner les données utilisateur
            $userData = [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'email' => $user->getEmail(),
                'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i:s')
            ];

            return new JsonResponse([
                'success' => true,
                'message' => 'Connexion réussie',
                'user' => $userData
            ]);

        } catch (\Exception $e) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Erreur lors de la connexion'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/logout', name: 'logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        // Pour une authentification locale, le logout se fait côté client
        return new JsonResponse([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }
}
