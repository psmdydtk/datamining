package com.mining.analysis;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.snu.ids.kkma.ma.MExpression;
import org.snu.ids.kkma.ma.MorphemeAnalyzer;
import org.snu.ids.kkma.ma.Sentence;


public class AnalysisComment {
	public String getValue = null;
	
	//형태소 분류 작업
	public Map<String, Object> getAlc(List<Map<String, Object>> transData) {
		int cntAly = 0; // 분류한 형태소 개수 
		int cntCht = 0; // 분류한 댓글중 널값인 댓글 개수
		List<Map<String,Object>> result = new ArrayList<>();//형태소분석용
		List<Map<String,Object>> listCount = new ArrayList<>();//빈도수 분석용
		Map<String,Object> resultCount = new HashMap<>(); //count분석용
		Map<String,Object> resultt = new HashMap<>();//최종리턴용
		MorphemeAnalyzer ma = new MorphemeAnalyzer();//라이브러리 코드
		List<MExpression> ret;
		ma.createLogger(null);
		for(Map<String, Object>row : transData){
			Map<String, Object> paramMap = new HashMap<String, Object>();
			//id,comment,star 를 가지고온 다음 맵객체에 put
			String id = nullToBlank(row.get("id"));
			String comment = nullToBlank(row.get("comment"));
			String star = nullToBlank(row.get("star"));
			paramMap.put(id, comment);
			paramMap.put("star", star);
			Map<String, Object>results = new HashMap<>();
			for (String key : paramMap.keySet()) {
				if(key == "star"){
					results.put("star", paramMap.get(key));
				}
				else{
					getValue = paramMap.get(key).toString();
					try {
						ret = ma.analyze(getValue);
						ret = ma.postProcess(ret);
						ret = ma.leaveJustBest(ret);
						List<Sentence> stl = ma.divideToSentences(ret);
						ArrayList<String> report = new ArrayList<>(); // 리포트용
						//System.out.println(stl);
						ArrayList<String> analysis = new ArrayList<>();
						for (int i = 0; i < stl.size(); i++) {
							Sentence st = stl.get(i); //분석한객체 쪼개기 
							for (int j = 0; j < st.size(); j++) {
								String original = st.get(j).toString(); //형태소로 변환한 원본 데이터
								//System.out.println(original);
								String[] ogAry = original.split("/"); //원본 데이터 배열로 변환
								for (int t = 2; t < ogAry.length; t += 2) {
									//System.out.print(ogAry[t-1] + "  " +ogAry[t] + "  ");
									report.add(ogAry[t-1]);
									report.add(ogAry[t]);
									//listCount에 추가할 객체로 동사와 일반명사만 수집하여 빈도수 확인할때 사용
									boolean conNnp = ogAry[t].contains("NNP");// 동사
									boolean conNng = ogAry[t].contains("NNG"); // 일반명사
									if (conNnp ||  conNng) {
										analysis.add(ogAry[t - 1]);
									}
								}
							}
							//System.out.println(report);
						} // for문끝
						
						//빈도수 확인용 listCount put 작업
						ArrayList<String> ary = new ArrayList<>();
						for (int t = 0; t < analysis.size(); t++) {
							ary.add(analysis.get(t));
							cntAly++;
							resultCount.put(key,ary);
						}
						listCount.add(resultCount);
						
						//분류한 형태소를 태그별로 다시 분류하기 위한 firstCheck에 데이터 보내서 받기
						Map<String,ArrayList<String>> transMap = firstCheck(report);
						//System.out.println(key + "  |  " + transMap);
						results.put("id", key);
						for(String str : transMap.keySet()){
							results.put(str, transMap.get(str));
							//System.out.println(key + " "+transMap.get(str));
							cntAly++;
						}
						result.add(results);
					} catch (Exception e) {
						// e.printStackTrace();
						cntCht++;
					}
				}
			}
	 }
		System.out.println(cntAly + "번째 배열 넣기 끝" + " 총 " + cntCht + " 개의 데이터가 비어있음");
		resultt.put("result",result);
		resultt.put("listCount", listCount);
		return resultt;
	} // getAlc 끝 =========================================================================
	
	
	
	
	//처음 데이터를 분리하는 과정   va||jx||nnp||nng 일경우의 데이터를 분류함.
	public static Map<String,ArrayList<String>>firstCheck(ArrayList<String> ogAry){ 
		ArrayList<String> elseWord = new ArrayList<String>();
		Map<String, ArrayList<String>> aryResult = new HashMap<>();
		int countComment = 1;
		for(int i=1; i<ogAry.size();i+=2){
			//if va||jx 일때 
			if(ogAry.get(i).contains("VA")|| ogAry.get(i).contains("JX")){
				ArrayList<String> resultvaJx= vaJx(ogAry,i);
				//분류한 객체가 완벽히 미리정의한 태그와 맞지않으면 널값을 리턴하므로 데이터 검사 작업 필
				if(resultvaJx == null|| resultvaJx.get(0) == ""){
					elseWord.add(ogAry.get(i-1));
				}
				else{
					aryResult.put("comment"+countComment, resultvaJx);
					countComment++;
				}
			}//if va||jx 일때  끝
			
			//nng일때
			else if(ogAry.get(i).contains("NNG")){
				ArrayList<String> resultvaJx= nng(ogAry,i);
				if(resultvaJx == null || resultvaJx.get(0) == ""){
					elseWord.add(ogAry.get(i-1));
				}
				else{
					aryResult.put("comment"+countComment,resultvaJx);
					countComment++;
				}
			}//nng일때 끝
			
			//nnp일때
			else if(ogAry.get(i).contains("NNP")){
				elseWord.add(ogAry.get(i-1));
			}//nnp일때 끝
			else if(ogAry.get(i).contains("VV")){
				elseWord.add(ogAry.get(i-1));
			}
			//아무것도 안걸렸을때
			else{
			}
		}//for문끝
		if(elseWord == null || elseWord.get(0) == ""){
			aryResult.put("comment", elseWord);
		}
		else{
			aryResult.put("comment", elseWord);
		}
		//System.out.println("firstCheck 최종데이터" + aryResult);
		return aryResult;
	}
	
	
	
	//va 나 jx 일경우
	public static ArrayList<String> vaJx(ArrayList<String> ogAry,int num){
		ArrayList<String> ary = new ArrayList<String>();
		int depth = 1;
		if(ogAry.size()>num+2){
				if(ogAry.get(num+2).contains("NNG")||ogAry.get(num+2).contains("VA")
						||ogAry.get(num+2).contains("VV")){
					ary = depthAdd(ogAry,num,depth);
				}
				else{
					return null;
				}
			
		}
		else{
			return null;
		}
		
		
		return ary;
	}
	
	
	
	//nng일경우
	public static ArrayList<String> nng(ArrayList<String> ogAry,int num){
		ArrayList<String> ary = new ArrayList<String>();
		int depth =1;
		if(ogAry.size()>num+2){
			//nng - vv||va||mag||nng
			if(ogAry.get(num+2).contains("VV")||ogAry.get(num+2).contains("VA")
					||ogAry.get(num+2).contains("MAG")||ogAry.get(num+2).contains("NNG")){
				ary=depthAdd(ogAry,num,depth);
			}
			//nng - jx
			else if(ogAry.get(num+2).contains("JX")){
				if(ogAry.size()>num+4){
					depth = 2;
					//nng - jx - nng||va||vv
					if(ogAry.get(num+4).contains("NNG")||ogAry.get(num+4).contains("VA")||ogAry.get(num+4).contains("VV")){
						ary=depthAdd(ogAry,num,depth);
					}
					//nng - jx - mag -
					else if(ogAry.get(num+4).contains("MAG")){
						if(ogAry.size()>num+6){
							depth = 3;
							// nng - jx - mag - nng || va || vv 
							if(ogAry.get(num+6).contains("NNG")||ogAry.get(num+6).contains("VA")
									||ogAry.get(num+6).contains("VV")){
								ary=depthAdd(ogAry,num,depth);
							}
						}
					}
				
				}
			}//NNG - JX일떄 끝
			
			else if(ogAry.get(num+2).contains("JKS")){
				if(ogAry.size()>num+4){
					depth = 2;
					//nng - jks - va || vv || mag
					if(ogAry.get(num+4).contains("VA") ||ogAry.get(num+4).contains("VV") ||ogAry.get(num+4).contains("MAG")){
						ary=depthAdd(ogAry,num,depth);
					}
				}
			}//NNG - JKS일떄 끝
			else if(ogAry.get(num+2).contains("JKM")){
				if(ogAry.size()>num+4){
					depth=2;
					//nng - jkm - va || vv
					if(ogAry.get(num+4).contains("VA") ||ogAry.get(num+4).contains("VV")){
						ary = depthAdd(ogAry,num,depth);
					}
				}
			}//NNG - JKM 일때 끝
			
			//nng - jc - NNG || ol  - va || vv
			else if(ogAry.get(num+2).contains("JC")){
				if(ogAry.size()>num+4){
					depth=2;
					if(ogAry.get(num+4).contains("NNG")||ogAry.get(num+4).contains("OL")){
						if(ogAry.size()>num+6){
							if(ogAry.get(num+6).contains("VA")||ogAry.get(num+6).contains("VV")){
								ary = depthAdd(ogAry,num,depth);
							}
						}
					}
				}
			}
			else{ //nng 이나 뒤에 정의하지 않는 태그가 들어왓을때 
				return null;
			}
		}
		//nng이나 길이가 2가안될때
		else{
			return null;
		}
		return ary;
	}
	
	
	//depth 에 따라 ary 에 add 해주는 작업
	public static ArrayList<String> depthAdd (ArrayList<String> ogAry,int num,int depth){
		ArrayList<String> ary = new ArrayList<String>();
		if(depth == 1){
			ary.add(ogAry.get(num-1));
			ary.add(ogAry.get(num+1));
		}
		else if(depth == 2){
			ary.add(ogAry.get(num-1));
			ary.add(ogAry.get(num+1));
			ary.add(ogAry.get(num+3));
		}
		else if(depth == 3){
			ary.add(ogAry.get(num-1));
			ary.add(ogAry.get(num+1));
			ary.add(ogAry.get(num+3));
			ary.add(ogAry.get(num+5));//태그값 보고싶을경우 ogAry.get(num)  0,2,4,6 까지 같이추가하면됨.
		}
		return ary;
	}

	public static String nullToBlank(Object comment) {
        if (comment == null) return "";
        return String.valueOf(comment).trim();
    }
}
