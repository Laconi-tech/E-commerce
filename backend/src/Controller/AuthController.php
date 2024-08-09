<?php
namespace App\Controller;

use App\Entity\Client;
use App\Entity\Panier;
use App\Entity\MoyenDePaiement;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface; // Ajoutez cette ligne
class AuthController extends AbstractController
{
    /**
     * @Route("/api/register", name="api_register", methods={"POST"})
     */
    public function createClient(Request $request, EntityManagerInterface $entityManager, JWTTokenManagerInterface $jwtManager): Response
    {
        $data = json_decode($request->getContent(), true);

        $client = new Client();
        $client->setEmail($data['email']);
        $client->setPassword($data['password']);
        $client->setNom($data['nom']);
        $client->setPrenom($data['prenom']);
        // $client->setAdresse($data['adresse']);
        $client->setVille($data['ville']);
        $client->setAdresse($data['adresse']);
        $client->setRoles(["ROLE_USER"]);
        $client->setIdPays($data['id_pays']);
        $client->setVisites(0); 
        
        $entityManager->persist($client);
        $entityManager->flush();

        $panier = new Panier();
        $panier->setIdClient($client->getId());

        $entityManager->persist($panier);
        $entityManager->flush();

        $newMoyen = new MoyenDePaiement();
        $newMoyen->setClientId($client->getId());
        $newMoyen->setNOM($data['nom']);
        $entityManager->persist($newMoyen);
        $entityManager->flush();
        
        $updatedClient = $entityManager->getRepository(Client::class)->find($client->getId());
    
        $token = $jwtManager->create($updatedClient);

        $clientData = [
            'id' => $updatedClient->getId(),
            'email' => $updatedClient->getEmail(),
            'nom' => $updatedClient->getNom(),
            'prenom' => $updatedClient->getPrenom(),
            'ville' => $updatedClient->getVille(),
            'id_pays' => $updatedClient->getIdPays(),
        ];
        
        $cookie = new Cookie('BEARER_TOKEN', $token, strtotime('+1 day'), '/', null, false, true);
        $response = new JsonResponse(['client' => $clientData, 'token' => $token]);
        $response->headers->setCookie($cookie);
        return $response;
    }

    /**
     * @Route("/register", name="register", methods={"POST"})
     */
    public function register(Request $request, EntityManagerInterface $entityManager, JWTTokenManagerInterface $jwtManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $id_panier = $data['panier'];
        $client = new Client();
        $client->setEmail($data['email']);
        $client->setPassword($data['password']);
        $client->setNom($data['nom']);
        $client->setPrenom($data['prenom']);
        $client->setAdresse($data['adresse']);
        $client->setVille($data['ville']);
        $client->setRoles(["ROLE_USER"]);
        $client->setIdPays($data['id_pays']);
        $client->setVisites(0); 
        
        $entityManager->persist($client);
        $entityManager->flush();

        $panier = $entityManager->getRepository(Panier::class)->findOneBy(["id" => $id_panier]);
        $panier->setIdClient($client->getId());

        $entityManager->persist($panier);
        $entityManager->flush();

        $newMoyen = new MoyenDePaiement();
        $newMoyen->setClientId($client->getId());
        $newMoyen->setNOM($data['nom']);
        $entityManager->persist($newMoyen);
        $entityManager->flush();
        
        $updatedClient = $entityManager->getRepository(Client::class)->find($client->getId());
    
        $token = $jwtManager->create($updatedClient);

        $clientData = [
            'id' => $updatedClient->getId(),
            'email' => $updatedClient->getEmail(),
            'nom' => $updatedClient->getNom(),
            'prenom' => $updatedClient->getPrenom(),
            'ville' => $updatedClient->getVille(),
            'id_pays' => $updatedClient->getIdPays(),
        ];
        
        $cookie = new Cookie('BEARER_TOKEN', $token, strtotime('+1 day'), '/', null, false, true);
        $response = new JsonResponse(['client' => $clientData, 'token' => $token]);
        $response->headers->setCookie($cookie);
        return $response;
    }
/**
 * @Route("/api/update", name="api_profile_update", methods={"POST"})
 */
public function updateProfile(Request $request, EntityManagerInterface $entityManager): Response
    {
        $data = json_decode($request->getContent(), true);
        $clientId = $data['id'];

        // Récupérez le client à partir de l'ID du client
        $client = $entityManager->getRepository(Client::class)->find($clientId);

        if (!$client) {
            return new JsonResponse(['message' => 'Client non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Mettez à jour les informations du client
        if (isset($data['email'])) {
            $client->setEmail($data['email']);
        }
        if (isset($data['password'])) {
            $client->setPassword($data['password']);
        }
        if (isset($data['nom'])) {
            $client->setNom($data['nom']);
        }
        if (isset($data['prenom'])) {
            $client->setPrenom($data['prenom']);
        }
        if (isset($data['adresse'])) {
            $client->setAdresse($data['adresse']);
        }
        if (isset($data['ville'])) {
            $client->setVille($data['ville']);
        }
        
        // Mettez à jour d'autres propriétés du client ici

        // Enregistrez les modifications dans la base de données
        $entityManager->flush();

        // Retournez une réponse réussie
        return new JsonResponse(['message' => 'Profil mis à jour avec succès']);
    }



}
