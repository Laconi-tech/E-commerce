<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Article;
use App\Entity\Categorie;
use App\Entity\Client;
use App\Entity\Pays;
use App\Entity\Panier;
use App\Entity\Order;
use App\Entity\MoyenDePaiement;
use App\Entity\PanierArticle;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Nelmio\CorsBundle\Annotation\Cors;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Dompdf\Options;
use Dompdf\Dompdf;

class ExcelController extends AbstractController
{
    /*
    * @Route(/client, name="client")
    */
    public function getClient(EntityManagerInterface $entityManager): Response
    {
        $clientRepository = $entityManager->getRepository(Client::class);
        $clients = $clientRepository->findBy([], ['visites' => 'DESC']);
        $clientArray = [];
        foreach ($clients as $client){
            $clientId = $client->getIdPays();
            $clientPays = $entityManager->getRepository(Pays::class)->find($clientId);
            $clientArray[] = [
                'id' => $client->getId(),
                'email' => $client->getEmail(),
                'nom' => $client->getNom(),
                'prenom' => $client->getPrenom(),
                'ville' => $client->getVille(),
                'adresse' => $client->getAdresse(),
                'roles' => $client->getRoles(),
                'pays' => $clientPays->getNom(),
            ];
        }
        return new JsonResponse($clientArray);
    }

    /**
 * @Route("/orders", name="orders")
 */
public function getOrders(EntityManagerInterface $entityManager)
{
    $orderRepository = $entityManager->getRepository(Order::class);
    $orders = $orderRepository->findAll();

    $orderArray = [];
    foreach ($orders as $order) {
        $orderItems = $entityManager->getRepository(PanierArticle::class)->findBy(["id_panier" => $order->getIdPanier()]);
        $articleDetails = [];
        
        foreach ($orderItems as $orderItem) {
            $article = $entityManager->getRepository(Article::class)->find($orderItem->getIdArticle());
            $articleDetails[] = [
                'id_article' => $article->getId(),
                'description' => $article->getDescription(),
                'prix' => $article->getPrix(),
                'photo_url' => $article->getPhotoUrl(),
                'rabais' => $article->getRabaisPct(),
                
            ];
        }
        $oID = $order->getIdClient();
        $client = $entityManager->getRepository(Client::class)->find($oID);
        $clientId = $client->getIdPays();
        $clientPays = $entityManager->getRepository(Pays::class)->find($clientId);
        $orderArray[] = [
            'id' => $order->getId(),
            'id_client' => $order->getIdClient(),
            'nom' => $client->getPrenom(),
            'prenom' => $client->getNom(),
            'id_panier' => $order->getIdPanier(),
            'date' => $order->getDate()->format('Y-m-d H:i:s'),
            'prix' => $order->getPrix(),
            'pays' => $clientPays->getNom(),
            'adresse' => $order->getAdresse(),
            'ville' => $order->getVille(),
            'is_expedited' => $order->getIsExpedited(),
            'commande_id' => $order->getCommandeId(),
            'panierData' => $articleDetails,
        ];
    }

    return new JsonResponse($orderArray);
}
    

    
}