<?php

namespace App\Controller;

use App\Entity\Client;
use App\Entity\Panier;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Security;

class LoginController extends AbstractController
{
    /**
     * @Route("/api/login", name="api_login", methods={"POST"})
     */
    private $entityManager;
    private $requestStack;

    public function __construct(EntityManagerInterface $entityManager, RequestStack $requestStack)
    {
        $this->entityManager = $entityManager;
        $this->requestStack = $requestStack;
    }


    public function login(Request $request, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager): Response
{
    $data = json_decode($request->getContent(), true);

    $userRepository = $this->entityManager->getRepository(Client::class);
    $user = $userRepository->findOneBy(['email' => $data['email']]);

    if (!$user) {
        throw new BadCredentialsException('Utilisateur non trouvé.');
    }

    if (!$passwordHasher->isPasswordValid($user, $data['password'])) {
        throw new BadCredentialsException('Mot de passe incorrect.');
    }

    $token = $jwtManager->create($user);

    // Créer un cookie pour stocker le token JWT
    $cookie = new Cookie('BEARER_TOKEN', $token, strtotime('+1 day'), '/', null, false, true); // Modifier selon vos besoins

    // Ajouter le cookie à la réponse
    $response = new JsonResponse(['message' => 'Connexion réussie.' , 'token' => $token]);
    $response->headers->setCookie($cookie);

    return $response;
}

/**
     * @Route("/api/profile", name="get_profile", methods={"GET"})
     */
    public function getUserData(Security $security): JsonResponse
    {
        $user = $security->getUser();

        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non connecté.'], 401);
        }

        // Customize this part to return the desired user data
        $userData = [
            'nom' => $user->getNom(),
            'prenom' => $user->getPrenom(),
            'admin' => $user->getRoles(),
            'id' => $user->getId(),
            'id_pays' => $user->getIdPays(),
            'adresse' => $user->getAdresse(),
            'ville' => $user->getVille(),
            'email' => $user->getEmail(),
            // Add more fields as needed
        ];

        return new JsonResponse($userData);
    }

    /**
     * @Route("/login", name="login", methods={"POST"})
     */
    public function loginnoco(Request $request, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager): Response
    {
    $data = json_decode($request->getContent(), true);
    $id_panier = $data["panier"];
    $userRepository = $this->entityManager->getRepository(Client::class);
    $user = $userRepository->findOneBy(['email' => $data['email']]);
    $panierRepo = $this->entityManager->getRepository(Panier::class);
    $panier = $panierRepo->findOneBy(["id" => $id_panier]);
    
    $panier->setIdClient($user->getId());
    $this->entityManager->persist($panier);
    $this->entityManager->flush();

    
    
    if (!$user) {
        throw new BadCredentialsException('Utilisateur non trouvé.');
    }

    if (!$passwordHasher->isPasswordValid($user, $data['password'])) {
        throw new BadCredentialsException('Mot de passe incorrect.');
    }

    $token = $jwtManager->create($user);

    // Créer un cookie pour stocker le token JWT
    $cookie = new Cookie('BEARER_TOKEN', $token, strtotime('+1 day'), '/', null, false, true);

    // Ajouter le cookie à la réponse
    $response = new JsonResponse(['message' => 'Connexion réussie.' , 'token' => $token]);
    $response->headers->setCookie($cookie);

    return $response;
    }




}