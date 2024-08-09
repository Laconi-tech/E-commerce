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
use App\Entity\Commentaire;
use App\Entity\MoyenDePaiement;
use App\Entity\PanierArticle;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Nelmio\CorsBundle\Annotation\Cors;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\HttpFoundation\Cookie;


class ApiController extends AbstractController
{
    /** 
     *@Cors()
     *@Route("/api/article", name="api_article" schemes={"http"} , methods)
     */
    public function getArticle(EntityManagerInterface $entityManager)
    {
        $categorieRepository = $entityManager->getRepository(Categorie::class);

        $articleRepository = $entityManager->getRepository(Article::class);
        $articles = $articleRepository->findBy([], ['id' => 'DESC']);

        $articleArray = [];
        foreach ($articles as $article) {
            if ($article->getId() === 6) {
                continue;
            }
            $categorie = $categorieRepository->find($article->getIdCategorie(),);


            $articleArray[] = [
                'id' => $article->getId(),
                'description' => $article->getDescription(),
                'photo' => $article->getPhoto(),
                'photo_url' => $article->getPhotoUrl(),
                'caracteristiques' => $article->getCaracteristiques(),
                'prix' => $article->getPrix(),
                'stock' => $article->getStock(),
                'id_categorie' => $article->getIdCategorie(),
                'categorie' => $categorie ? $categorie->getCategorie() : null,
                'consultation' => $article->getConsultation(),
                'rabais' => $article->getRabaisPct(),
                'dateadd' => $article->getDateAdd(),
                'poids' => $article->getPoids(),
            ];
        }

        return new JsonResponse($articleArray);
    }



    /**
     * @Route("/api/article/{id}", name="api_article_detail", methods={"GET", "POST"}, requirements={"id"="\d+"}, schemes={"http"})
     */
    public function getArticleDetail(string $id = null, EntityManagerInterface $entityManager)
    {
        if ($id === null || $id === '') {
            $id = 1;
        } else {
            $id = (int)$id;
        }

        $categorieRepository = $entityManager->getRepository(Categorie::class);
        $articleRepository = $entityManager->getRepository(Article::class);
        $article = $articleRepository->find($id);

        if (!$article) {
            throw $this->createNotFoundException('Article non trouvÃ©.');
        }

        $categorie = $categorieRepository->find($article->getIdCategorie());

    $articleData = [
        'id' => $article->getId(),
        'description' => $article->getDescription(),
        'photo' => $article->getPhoto(),
        'photo_url' => $article->getPhotoUrl(),
        'caracteristiques' => $article->getCaracteristiques(),
        'prix' => $article->getPrix(),
        'stock' => $article->getStock(),
        'id_categorie' => $article->getIdCategorie(),
        'consultation' => $article->getConsultation(),
        'categorie' => $categorie ? $categorie->getCategorie() : null,
        'rabais' => $article->getRabaisPct(),
        'dateadd' => $article->getDateAdd(),
        'poids' => $article->getPoids()
    ];


        return new JsonResponse($articleData);
    }

    /** 
     *@Route("/api/client", name="api_client" schemes={"http"})
     */
    public function getClient(EntityManagerInterface $entityManager)
    {
        $paysRepository = $entityManager->getRepository(Pays::class);
        $clientRepository = $entityManager->getRepository(Client::class);
        $clients = $clientRepository->findAll();

        $clientArray = [];

        foreach ($clients as $client) {
            $pays = $paysRepository->find($client->getIdPays());
            $clientArray[] = [
                'id' => $client->getId(),
                'email' => $client->getEmail(),
                'password' => $client->getPassword(),
                'nom' => $client->getNom(),
                'prenom' => $client->getPrenom(),
                // 'adresse' => $client->getAdresse(),
                'ville' => $client->getVille(),
                'is_admin' => $client->getIsAdmin(),
                'pays' => $pays ? $pays->getNom() : null
            ];
        }
        return new JsonResponse($clientArray);
    }

    /** 
     *@Route("/api/pays", name="api_pays" schemes={"http"})
     */
    public function getPays(EntityManagerInterface $entityManager)
    {
        $paysRepository = $paysRepository = $entityManager->getRepository(Pays::class);
        $pays = $paysRepository->findAll();
        $paysArray = [];
        foreach ($pays as $pay) {
            $paysArray[] = [
                'id' => $pay->getId(),
                'nom' => $pay->getNom(),
                'frais_de_port' => $pay->getFraisDePort()
            ];
        }
        return new JsonResponse($paysArray);
    }
    /**
     *@Route("/api/categorie", name="api_categorie" schemes={"http"})
     */

    public function getCategorie(EntityManagerInterface $entityManager)
    {
        $categorieRepository = $entityManager->getRepository(Categorie::class);
        $categories = $categorieRepository->findAll();
        $categoriesArray = [];
        foreach ($categories as $categorie) {
            $categoriesArray[] = [
                'id' => $categorie->getId(),
                'categorie' => $categorie->getCategorie(),
            ];
        }
        return new JsonResponse($categoriesArray);
    }
    /**
     *@Route("/consultation" , name="consultation", methods:{"POST"})
     */
    public function addConsultation(EntityManagerInterface $entityManager, Request $request)
    {
        $requestData = json_decode($request->getContent(), true);
        $id = $requestData['id'];
        $articleRepository = $entityManager->getRepository(Article::class);
        $article = $articleRepository->find($id);
        $consultation = $article->getConsultation();
        $consultation1 = $consultation + 1;
        $article->setConsultation($consultation1);

        $entityManager->flush();

        return new Response('Données mises à jour avec succès.');
    }

    /**
     * @Route(/make/panier, name="make_panier, methods={"POST"})
     */
    public function makePanier(EntityManagerInterface $entityManager, Request $request)
    {
        $panierData = json_decode($request->getContent(), true);
        $id = $panierData['id'];
        $prix = $panierData['prix'];
        $id_client = $panierData['id_user'];
        $panierRepository = $entityManager->getRepository(Panier::class);
        $articleRepository = $entityManager->getRepository(Article::class);
        $article = $articleRepository->findOneBy(["id" => $id]);
        $panier = $panierRepository->findOneBy(
            ["id_client" => $id_client],
            ["id" => "DESC"]
        );
        $stock = $article->getStock();
        $panierId = $panier->getId();
        $prixPanier = $panier->getPrix();
        $rabais = $article->getRabaisPct();
        $panierArticle = new PanierArticle();

        $panierArticle->setIdArticle($id);
        $panierArticle->setIdPanier($panierId);

        $entityManager->persist($panierArticle);
        $entityManager->flush();
        

        if ($rabais > 0) {
        $prixAvecRabais = $prix * (1 - ($rabais / 100)); // Calcul du prix avec le rabais
        $panier->setPrix($prixPanier + $prixAvecRabais);
        }
        else{
           $panier->setPrix($prixPanier + $prix); 
        }
            
        $entityManager->persist($panier);
        $entityManager->flush();

        

        // $article->setStock($stock -1);
        // $entityManager->persist($article);
        // $entityManager->flush();
    



        return new Response('Saved new Panier with id ' . $panier->getId());
    }

    /**
     * @Route(/panier/{id_client}, name="panier" , methods:{"GET"})
     */
    public function getPanierItems(EntityManagerInterface $entityManager, Request $request, $id_client): Response
    {
        $panierRepository = $entityManager->getRepository(Panier::class);
        $panier = $panierRepository->findOneBy(
            ["id_client" => $id_client],
            ["id" => "DESC"]
        );

        $articleIdToInclude = 6;
        $maximumPrice = 100;
        $panierArticleRepository = $entityManager->getRepository(PanierArticle::class);
        $panierItems = $panierArticleRepository->findBy(["id_panier" => $panier->getId()]);
        $panierData = [];
        $articleRepository = $entityManager->getRepository(Article::class);
        foreach ($panierItems as $panierItem) {
            $articleId = $panierItem->getIdArticle();
            $article = $articleRepository->find($articleId);


            $panierData[] = [
                'id' => $panierItem->getId(),
                'id_article' => $article->getId(),
                'photo_url' => $article->getPhotoUrl(),
                'description' => $article->getDescription(),
                'prix' => $article->getPrix(),
                'id_panier' => $panierItem->getIdPanier(),
                'rabais' => $article->getRabaisPct(),
                'prix_total' => $panier->getPrix(),
                'poids' => $article->getPoids()
            ];
        }
        
        return new JsonResponse($panierData);
    }

    /**
     *  @Route(/panier/{id_panier}, name="paniernoco" , methods:{"GET"})
     */
    public function getPanierItemsNoco(EntityManagerInterface $entityManager, Request $request, $id_panier) : Response
    {
        $panierRepository = $entityManager->getRepository(Panier::class);
        $panier = $panierRepository->findOneBy(
            ["id" => $id_panier],
        );
        $panierArticleRepository = $entityManager->getRepository(PanierArticle::class);
        $panierItems = $panierArticleRepository->findBy(["id_panier" => $panier->getId()]);
        $panierData = [];
        $articleRepository = $entityManager->getRepository(Article::class);
        foreach($panierItems as $panierItem){
            $articleId = $panierItem->getIdArticle();
            $article = $articleRepository->find($articleId);
            
            
            $panierData[] = [
                'id' => $panierItem->getId(),
                'id_article' => $article->getId(),
                'photo_url' => $article->getPhotoUrl(),
                'description' => $article->getDescription(),
                'prix' => $article->getPrix(),
                'id_panier' => $panierItem->getIdPanier(),
                'rabais' => $article->getRabaisPct(),
                'prix_total' => $panier->getPrix(),
            ];
        }
        return new JsonResponse($panierData);
    }


    /**
     * @Route(/cart/item, name="cart-item" , methods:{"POST"})
     */
    public function removeFromPanier(EntityManagerInterface $entityManager, Request $request): Response
    {
        $panierItemsData = json_decode($request->getContent(), true);
        $id = $panierItemsData['id'];
        $prix = $panierItemsData['prix'];
        $id_panier = $panierItemsData['id_panier'];
        $id_client = $panierItemsData['id_client'];

        $panierItemRepository = $entityManager->getRepository(PanierArticle::class);
        $panierItem = $panierItemRepository->findOneBy(["id" => $id]);
        $id_article = $panierItem->getIdArticle();
        $articleRepo = $entityManager->getRepository(Article::class);
        $article = $articleRepo->findOneBy(["id" => $id_article]);

        // Supprimer l'article du panier
        $entityManager->remove($panierItem);
        $entityManager->flush();

        // Récupérer le panier associé à l'utilisateur
        $panierRepository = $entityManager->getRepository(Panier::class);
        $panier = $panierRepository->findOneBy(
            ["id_client" => $id_client],
            ["id" => "DESC"]
        );

        // Mettre à jour le prix du panier en enlevant le prix de l'article
        $ancienPrixPanier = $panier->getPrix();
        $rabais = $article->getRabaisPct();

        if ($rabais > 0) {
            $prixAvecRabais = $prix * (1 - ($rabais / 100)); // Calcul du prix avec le rabais
            $nouveauPrixPanier = $ancienPrixPanier - $prixAvecRabais;
        } else {
            $nouveauPrixPanier = $ancienPrixPanier - $prix;
        }

        // Mettre à jour le prix du panier dans la base de données
        $panier->setPrix($nouveauPrixPanier);
        $entityManager->persist($panier);
        $entityManager->flush();

        $response = new Response("Article supprimé du panier");
        return $response;
    }

    /*
     *@Route(/recommander, name="recommander", methods:{"POST"})
     */
    public function recommander(EntityManagerInterface $entityManager, Request $request): Response
    {
        $articleData = json_decode($request->getContent(), true);
        $idarticle = $articleData['id'];
        
        $articleRepo = $entityManager->getRepository(Article::class);
        $article = $articleRepo->findOneBy(["id" => $idarticle]);
        $stock = $article->getStock();
        $article->setStock($stock + 100);
        $entityManager->persist($article);
        $entityManager->flush();

        $response = new Response("Le stock a été recommander");
        return $response;
    }

    /*
     *@Route(/make/commande, name="make-commande", methods:{"POST"})
     */
    public function makeCommande(EntityManagerInterface $entityManager, Request $request) : Response
    {
        $data = json_decode($request->getContent(), true);
        $id_client = $data['id_client'];
        $prix = $data['prix'];
        $id_pays = $data['id_pays'];
        $ville = $data['ville'];
        $adresse = $data['adresse'];
        // $panier45 = $data["panier"];
        $panierRepository = $entityManager->getRepository(Panier::class);
        $panier = $panierRepository->findOneBy(
            ["id_client" => $id_client],
            ["id" => "DESC"]
        );
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $commandeId = '';
        $length = 15;
        $charactersLength = strlen($characters);
        for ($i = 0; $i < $length; $i++) {
            $randomIndex = rand(0, $charactersLength - 1);
            $commandeId .= $characters[$randomIndex];
        }


        $panierId = $panier->getId();
        // Créer une nouvelle commande
        $commande = new Order();
        if($id_client !== null){
        $commande->setIdClient($id_client);
        $commande->setIdPanier($panierId);
        }
        else{
        $commande->setIdClient(28);
        $commande->setIdPanier($panier45);
        }
        
        $commande->setDate(new \DateTime());
        $commande->setPrix($prix);
        $commande->setIdPays($id_pays);
        $commande->setAdresse($adresse);
        $commande->setVille($ville);
        $commande->setIsExpedited(0);
        $commande->setCommandeId($commandeId);
        $entityManager->persist($commande);
        $entityManager->flush();

        //Nouveau Panier
        $newPanier = new Panier();
        $newPanier->setIdClient($id_client);
        $entityManager->persist($newPanier);
        $entityManager->flush();

        return new JsonResponse(["panier" => $panier]);

    }

    /*
    * @Route(/order/noco , name="make_noco" methods={"POST"})
    */
    public function orderNoco(EntityManagerInterface $entityManager, Request $request) : Response
    {
        $data = json_decode($request->getContent(), true);
        $prix = $data["prix"];
        $idPays = $data["id_pays"];
        $ville = $data["ville"];
        $adresse = $data["adresse"];
        $Idpanier = $data["panier"];

        $panierRepository = $entityManager->getRepository(Panier::class);
        $panier = $panierRepository->findOneBy(
            ["id" => $Idpanier]
        );
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $commandeId = '';
        $length = 15;
        $charactersLength = strlen($characters);
        for ($i = 0; $i < $length; $i++) {
            $randomIndex = rand(0, $charactersLength - 1);
            $commandeId .= $characters[$randomIndex];
        }

        $commande = new Order();
        // $commande->setIdClient(NULL);
        $commande->setIdPanier($Idpanier);
        $commande->setDate(new \DateTime());
        $commande->setPrix($prix);
        $commande->setIdPays($idPays);
        $commande->setAdresse($adresse);
        $commande->setVille($ville);
        $commande->setIsExpedited(0);
        $commande->setCommandeId($commandeId);
        $entityManager->persist($commande);
        $entityManager->flush();
        
        return new Response("Ca fonctionne bien");


    } 
    /*
    * @Route(/noconnect, name=noconnect, methods:{"POST"})
    */
    public function makePanierWithout(EntityManagerInterface $entityManager) : Response
    {
        $panier = new Panier ();       
        $entityManager->persist($panier);
        $entityManager->flush();
        $panier->getId();

        $panier2 = $entityManager->getRepository(Panier::class)->find($panier);
    

        $panierData = [
            'id' => $panier2->getId(),
            'prix' => $panier2->getPrix(),
            'id_client' => $panier2->getIdClient(),
        ];
        
        $response = new Response(json_encode(['cartId' => $panier2->getId()]));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    /*
    * @Route(/update/rabais, name=update_rabais, methods={"POST"})  
    */

    public function updateRabais(EntityManagerInterface $entityManager, Request $request) : Response
    {
        $data = json_decode($request->getContent(), true);
        $id_article = $data["id"];
        $new_rabais = $data["rabais"];
        
        $articleRepo = $entityManager->getRepository(Article::class);
        $article = $articleRepo->findOneBy(["id" => $id_article]);

        $article->setRabaisPct($new_rabais);
        $entityManager->persist($article);
        $entityManager->flush();

        return new Response("Le changement s'est bien effectué :)");
    }

    /*
    * @Route(/api/moyen) , name=moyen, methods={"POST"}
    */
    public function addMoyen(EntityManagerInterface $entityManager, Request $request) : Response
    {
        $data = json_decode($request->getContent(), true);
        $client_id = $data["client_id"];
        $nom = $data["nom"];
        $type = $data["type"];
        $numeroCarte = $data["NumeroCarte"]; $moyen = new MoyenDePaiement();
       
        $moyen->setClientId($client_id);
        $moyen->setNom($nom);
        $moyen->setTYPE($type);
        $moyen->setNumeroCarte($numeroCarte);

        $entityManager->persist($moyen);
        $entityManager->flush();

        return new JsonResponse(["id" => $moyen->getId()]);
    }

    /*
    * @Route(/moyen/{id_client}, name=moyen_get, methods={"GET"})
    */

    public function getMoyen(EntityManagerInterface $entityManager, $id_client)
    {
        $moyen = $entityManager->getRepository(MoyenDePaiement::class)->findOneBy(["client_id" => $id_client]);
        
        $moyenData [] = [
            "client_id" => $moyen->getClientId(),
            "nom" => $moyen->getNOM(),
            "type" => $moyen->getTYPE(),
            "numerocarte" => $moyen->getNumeroCarte()
        ];

        return new JsonResponse($moyenData);
    }

    /*
    * @Route(/moyenNoco/{id_moyen}, name=moyen_get_noco, methods={"GET"})
    */

    public function getMoyenNoco(EntityManagerInterface $entityManager, $id_moyen)
    {
        $moyen = $entityManager->getRepository(MoyenDePaiement::class)->findOneBy(["id" => $id_moyen]);
        
        $moyenData [] = [
            "client_id" => $moyen->getClientId(),
            "nom" => $moyen->getNOM(),
            "type" => $moyen->getTYPE(),
            "numerocarte" => $moyen->getNumeroCarte()
        ];

        return new JsonResponse($moyenData);
    }

    /*
    * @Route(/update/moyen, name=update, methods={"POST"})
    */
    public function setMoyen(EntityManagerInterface $entityManager, Request $request) : Response
    {
        $data = json_decode($request->getContent(), true);
        $id_client = $data["client_id"];
        $nom = $data["nom"];
        $type = $data["type"];
        $numero = $data["NumeroCarte"];
        
        if($id_client !== null){
            $moyen = $entityManager->getRepository(MoyenDePaiement::class)->findOneBy(["client_id" => $id_client]);
            $moyen->setClientId($id_client);
            $moyen->setNOM($nom);
            $moyen->setTYPE($type);
            $moyen->setNumeroCarte($numero);
        
            $entityManager->persist($moyen);
            $entityManager->flush();

            return new Response("Tes données ont été validé");
        }
    }
    

    /**
 * @Route("/api/orders", name="api_orders")
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
                'rabais' => $article->getRabaisPct()
            ];
        }

        $orderArray[] = [
            'id' => $order->getId(),
            'id_client' => $order->getIdClient(),
            'id_panier' => $order->getIdPanier(),
            'date' => $order->getDate()->format('Y-m-d H:i:s'),
            'prix' => $order->getPrix(),
            'id_pays' => $order->getIdPays(),
            'adresse' => $order->getAdresse(),
            'ville' => $order->getVille(),
            'is_expedited' => $order->getIsExpedited(),
            'commande_id' => $order->getCommandeId(),
            'panierData' => $articleDetails,
        ];
    }

    return new JsonResponse($orderArray);
}
    /*
    * @Route(/api/pays/{id_pays} , name="pays_detail" methods={"GET"})
    */
    public function getDetails(EntityManagerInterface $entityManager, $id_pays): Response
    {
        $pays = $entityManager->getRepository(Pays::class)->findOneBy(["id" => $id_pays]);
        $paysArray[] = [
            'id' => $pays->getId(),
            'nom' => $pays->getNom(),
            'frais' => $pays->getFraisDePort()
        ];

        return new JsonResponse($paysArray);
    }

    /*
    *@Route(/api/commentaire , name="api_commentaire")
    */
    public function setCommentaire(EntityManagerInterface $entityManager, Request $request): Response
    {

        $data = json_decode($request->getContent(), true);
        $articleId = $data["articleId"];
        $clientId = $data["clientId"];
        $comment = $data["comment"];
        $commentaire = new Commentaire();
        $commentaire->setIdArticle($articleId);
        $commentaire->setIdClients($clientId);
        $commentaire->setCommentaire($comment);
        $entityManager->persist($commentaire);
        $entityManager->flush();

        return new Response("sussces send");
    }

    /*
    *@(Route /commentaires , name="commentaires)
    */
    public function getCommentaire(EntityManagerInterface $entityManager) : Response
    {
        $commentaires = $entityManager->getRepository(Commentaire::class)->findAll();
        $commentairesArray = [];
    
        foreach($commentaires as $commentaire){
            $commentairesArray[] = [
                "id" => $commentaire->getId(),
                "id_article" => $commentaire->getIdArticle(),
                "id_client" => $commentaire->getIdClients(),
                "commentaire" => $commentaire->getCommentaire()
                
            ];
        }
        return new JsonResponse($commentairesArray);
    }

    /*
    *@(Route /commentaires/{id_article} , name="commentairesD)
    */
    public function getCommentaireD(EntityManagerInterface $entityManager, $id_article) : Response
    {
        $commentaires = $entityManager->getRepository(Commentaire::class)->findBY(["id_article" => $id_article]);
        $commentairesArray = [];
        foreach ($commentaires as $commentaire){
        $client = $commentaire->getIdClients();
        $clientRepo = $entityManager->getRepository(Client::class)->findOneBy(["id" => $client]);
        
        $commentairesArray[] = [
                "id" => $commentaire->getId(),
                "id_article" => $commentaire->getIdArticle(),
                "id_client" => $commentaire->getIdClients(),
                "commentaire" => $commentaire->getCommentaire(),
                "prenom" => $clientRepo->getPrenom(),
                "nom" => $clientRepo->getNom(),
            ];
        }
        return new JsonResponse($commentairesArray);
    }


}