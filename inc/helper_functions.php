<?php
    /**
    * Curl function
     *
     * Used from the wordpress server to access the doolli api,
     * in this way hiddin this process from the client-side and making it mode secure
     *
     * @param
     *      $url {String} - the url (being an doolli api url)
     *
     * @return {JSON} - the response from the api
     */
    function curl_fn($url = "http://www.google.ro") {
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_RETURNTRANSFER  => TRUE,
            CURLOPT_SSL_VERIFYPEER  => TRUE,
            CURLOPT_SSL_VERIFYHOST  => 2,
            CURLOPT_CAINFO          => ABSPATH . WPINC . '/certificates/ca-bundle.crt',
            CURLOPT_URL             => $url
            )
        );

        $results = curl_exec($curl);
        if(!$results) {
            die('Error: "' . curl_error($curl) . '" - Code: ' . curl_errno($curl));
        }

        return json_decode($results, true);

        curl_close($curl);
    }
?>