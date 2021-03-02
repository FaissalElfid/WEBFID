<?php

namespace App\Http\Controllers;

use App\Departement;
use Illuminate\Http\Request;
use App\Employe;

class DepartementController extends Controller
{
    public function index() {
        $departements = Departement::all();
        return $departements;
    }
    public function affichage() {
        $departements = Departement::all();

        $affichages = array();
        foreach($departements as $departement){
            $affichage = array();
            $affichage['libelle'] = $departement['libelle'];
            $affichage['chef'] = Employe::find($departement['chef_id']);
            $affichage['interne'] = $departement['interne'];
            array_push($affichages, $affichage);
        }
        return $affichages;
    }
    public function store(Request $request) {
        return Departement::create([
            'libelle' => $request['libelleAdd'],
            'chef_id' => $request['chefIdAdd'],
            'interne' => $request['interneAdd']
        ]);
    }

    public function create() {
        //
    }

    public function employes($libelle) {
        $departement = Departement::where('libelle', $libelle)->first()->employes; // where retourn une list
        return $departement;
    }

    public function edit($id) {
        $departement = Departement::find($id);
        return $departement;
    }

    public function update(Request $request, $id) {
        $departement = Departement::find($id);
        $departement->update($request->all());
        return response()->json(['message'=>'ca marche']);
    }

    public function destroy($id) {
        $departement = Departement::find($id);

        if($departement->delete()){
            return $this->refresh();
        }
        else{
            return response()->json(['error' => 'Delete method has failes'], 425);
        }

    }

    private function refresh()
    {
        $departements = Departement::orderBy('created_at', 'Desc');
        return response()->json($departements);
    }
}
