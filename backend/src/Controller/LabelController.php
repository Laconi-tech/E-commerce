<?php
namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class LabelController extends AbstractController
{
    /**
     * @Route("/create-label", methods={"POST"})
     */
    public function createLabel(Request $request): Response
    {
        $apiUrl = 'https://api.shipengine.com/v1/labels';
        $apiKey = 'VOTRE_CLE_API'; 

        $postData = [
        ];

        $httpClient = HttpClient::create();
        $response = $httpClient->request('POST', $apiUrl, [
            'headers' => [
                'Content-Type' => 'application/json',
                'API-Key' => $apiKey,
            ],
            'json' => $postData,
        ]);

        $statusCode = $response->getStatusCode();
        $responseData = $response->toArray();


        return new Response('Étiquette créée avec succès !');
    }
}
